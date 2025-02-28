import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { ModalComponent } from '@/components';
import { DocumentosService } from '@/services/service-empresas';
import { NotificationService } from '@/utils/services';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-filter',
  imports: [NgClass, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './filter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  public readonly open = signal(false);

  @HostListener('document:click', ['$event.target'])
  onClick(btn: any) {
    if (this.open() && !this.ref.nativeElement.contains(btn)) {
      this.open.set(false);
      this.form.reset();
    }
  }

  // @Input({ required: true }) ideEmisor!: number;

  @ViewChild('descargar') modal!: ModalComponent;

  @Output() public readonly buscarResult = new EventEmitter<string | null>();

  public readonly loading = signal(false);

  public readonly countInvoices = signal(0);

  public readonly minDate = computed(() => new Date().toISOString().split('T')[0]);

  public readonly maxDate = computed(() => {
    const startDate = this.form.get('start')?.value;
    if (!startDate) {
      return new Date().toISOString().split('T')[0]; // Fecha actual si no hay fecha de inicio
    }
    return startDate;
  });

  constructor(
    private readonly ref: ElementRef,
    private readonly _fb: FormBuilder,
    private readonly notification: NotificationService,
    private readonly docService: DocumentosService,
  ) {}

  form = this._fb.group({
    start: [null, Validators.required],
    end: [null, Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = {
      startDate: this.form.value.start,
      endDate: this.form.value.end,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.reportCreditoClientes(data)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_general_${Date.now().toString()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.notification.push({ message: 'Reporte generado con éxito.', type: 'success' });
      });
  }
}

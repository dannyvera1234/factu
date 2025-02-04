import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService, NotificationService } from '@/utils/services';
import { ModalComponent } from '@/components';
import { DocumentosService } from '@/services/service-empresas';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-filtro',
  imports: [ReactiveFormsModule, NgClass, NgOptimizedImage, ModalComponent],
  templateUrl: './filtro.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltroComponent {
  public readonly open = signal(false);

  @HostListener('document:click', ['$event.target'])
  onClick(btn: any) {
    if (this.open() && !this.ref.nativeElement.contains(btn)) {
      this.open.set(false);
      this.form.reset();
    }
  }

  @Input({ required: true }) ideEmisor!: number;

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
    private readonly modalService: ModalService,
    private readonly docService: DocumentosService,
  ) {
    this.form.controls.start.valueChanges.subscribe((startDate: any) => {
      if (startDate) {
        const endDateControl = this.form.get('end');
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 30); // Puede ajustar este valor si es necesario
        endDateControl?.setValue(currentDate.toISOString().split('T')[0]);
      }
    });
  }

  form = this._fb.group({
    start: ['', [Validators.required]],
    end: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.push({ message: 'Por favor ingrese una fecha de inicio y fin.', type: 'error' });
      return;
    }
    const data = {
      personaRolIde: this.ideEmisor,
      startDate: this.form.value.start,
      endDate: this.form.value.end,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.docCount(data)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.open.set(false);
          this.countInvoices.set(resp.data);
          this.modalService.open(this.modal);
        }
      });
  }

  descargarInvoices() {
    if (this.countInvoices() <= 0) {
      this.notification.push({ message: 'no hay facturas para descargar', type: 'error' });
      return;
    }

    const data = {
      personaRolIde: this.ideEmisor,
      startDate: this.form.value.start,
      endDate: this.form.value.end,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.generateZipWithDocuments(data)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((blob: Blob) => {

        const fileName = `Facturas_${this.form.value.start}_${this.form.value.end}_${this.formatDateWithoutSeparators(new Date())}.zip`;
        this.downloadZip(blob, fileName);
        this.form.reset();
        this.modalService.close(this.modal);
      });
  }

  formatDateWithoutSeparators(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Asegura dos dígitos
  const day = date.getDate().toString().padStart(2, '0'); // Asegura dos dígitos
  const hours = date.getHours().toString().padStart(2, '0'); // Asegura dos dígitos
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Asegura dos dígitos
  const seconds = date.getSeconds().toString().padStart(2, '0'); // Asegura dos dígitos

  // Formato sin separadores: yyyyMMddHHmmss
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

  downloadZip(blob: Blob, fileName: string): void {
    // Crear una URL de objeto para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un elemento de enlace (a) para simular la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Nombre del archivo que se va a descargar

    // Simular el clic en el enlace
    document.body.appendChild(a);
    a.click();

    // Limpiar
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

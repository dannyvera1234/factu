import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { CustomSelectComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agg-xml',
  imports: [CustomSelectComponent, ReactiveFormsModule],
  templateUrl: './agg-xml.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggXmlComponent {
  public readonly loading = signal(false);

  public readonly fileUrl = signal<any | null>(null);

  public readonly nameFile = signal<string | null>(null);

  // public readonly file = signal<File | null>(null);

  @Output() public readonly created = new EventEmitter<GeneriResp<any> | null>();

  public readonly categoriaProduct = computed<{ values: string[]; labels: string[] }>(() => {
    return Object.entries(this.configFacturacion.CategoriaCostoEnum()).reduce(
      (prev, [value, key]) => {
        prev.labels.push(key);
        prev.values.push(value);

        return prev;
      },
      { values: [] as string[], labels: [] as string[] },
    );
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private readonly notification: NotificationService,
    private readonly configFacturacion: ConfigFacturacionService,
    private readonly _fb: FormBuilder,
  ) {}

  form = this._fb.group({
    categoriaProduct: ['', [Validators.required]],
  });

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.isValidFileType(file)) {
        this.fileUrl.set(file);
        this.nameFile.set(file!.name);

        // Forzar la detección de cambios
        this.cdr.detectChanges();
      } else {
        this.fileUrl.set(null);
        this.notification.push({
          message: 'Tipo de archivo no permitido. Solo se permiten archivos XML.',
          type: 'error',
        });
        // Forzar la detección de cambios
        this.cdr.detectChanges();
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const acceptedFileTypes = ['application/xml', 'text/xml'];
    return acceptedFileTypes.includes(file.type);
  }

  removeLogo(): void {
    this.fileUrl.set(null);
    this.nameFile.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value, this.fileUrl());

    // of(this.loading.set(true))
    //   .pipe(
    //     mergeMap(() => this.emisorService.updateLogo(this.file())),
    //     finalize(() => this.loading.set(false)),
    //   )
    //   .subscribe((resp) => {
    //     if (resp.status === 'OK') {
    //       this.created.emit(resp);
    //       this.notification.push({
    //         message: 'Archivo XML actualizado correctamente.',
    //         type: 'success',
    //       });

    //       this.fileUrl.set(null);
    //     }
    //   });
  }
}

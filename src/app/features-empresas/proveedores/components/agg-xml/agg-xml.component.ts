import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { of, mergeMap, finalize } from 'rxjs';
import { ProveedorService } from '@/services/service-empresas';

@Component({
  selector: 'app-agg-xml',
  imports: [],
  templateUrl: './agg-xml.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggXmlComponent {
  public readonly loading = signal(false);

  public readonly fileUrl = signal<any | null>(null);

  public readonly nameFile = signal<string | null>(null);

  @Output() public readonly infoXML = new EventEmitter<GeneriResp<any> | null>();

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
    private readonly proveedorService: ProveedorService,

  ) {}

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
    if (!this.fileUrl()) {
      this.notification.push({
        message: 'Debe seleccionar un archivo XML.',
        type: 'error',
      });
      return;
    }

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.cargarXML(this.fileUrl())),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.infoXML.emit(resp.data);
          this.notification.push({
            message: 'Archivo XML cargado correctamente.',
            type: 'success',
          });
          this.fileUrl.set(null);
        }
      });
  }
}

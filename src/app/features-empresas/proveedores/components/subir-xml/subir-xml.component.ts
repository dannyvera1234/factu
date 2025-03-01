import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { NotificationService } from '../../../../utils/services';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp } from '../../../../interfaces';
import { ProveedorService } from '../../../../services/service-empresas';

@Component({
  selector: 'app-subir-xml',
  imports: [],
  templateUrl: './subir-xml.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubirXmlComponent {
  public readonly loading = signal(false);

  public readonly fileUrl = signal<any | null>(null);

  public readonly nameFile = signal<string | null>(null);

  @Output() public readonly created = new EventEmitter<any | null>();

  constructor(
    private notification: NotificationService,
    private proveedorService: ProveedorService,
  ) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.isValidFileType(file)) {
        this.fileUrl.set(file);
        this.nameFile.set(file!.name);
      } else {
        this.fileUrl.set(null);
        this.notification.push({
          message: 'Tipo de archivo no permitido. Solo se permiten archivos XML.',
          type: 'error',
        });
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
          this.created.emit(resp.data);
          this.notification.push({
            message: 'Archivo XML cargado correctamente.',
            type: 'success',
          });

          this.fileUrl.set(null);
        }
      });
  }
}

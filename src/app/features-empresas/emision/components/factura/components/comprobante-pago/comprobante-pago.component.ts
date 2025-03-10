import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NotificationService } from '../../../../../../utils/services';

@Component({
  selector: 'app-comprobante-pago',
  imports: [],
  templateUrl: './comprobante-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComprobantePagoComponent {
  public readonly logoUrl = signal<string | null>(null);
  public readonly file = signal<File | null>(null);

  constructor(private readonly notification: NotificationService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (this.isValidFileType(file)) {
      this.logoUrl.set(file.name);

      this.file.set(file);
    } else {
      this.logoUrl.set(null);
      this.notification.push({
        message: 'Tipo de archivo no permitido. Solo se permiten imágenes.',
        type: 'error',
      });

      // 🔹 Resetear el input para evitar problemas con la selección del mismo archivo
      input.value = '';
    }
  }

  private isValidFileType(file: File): boolean {
    const acceptedFileTypes = ['image/jpeg', 'image/png'];
    return acceptedFileTypes.includes(file.type);
  }

  removeFile(): void {
    this.logoUrl.set(null);
  }
}

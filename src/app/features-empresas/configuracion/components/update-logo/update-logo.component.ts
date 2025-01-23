import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { NotificationService } from '@/utils/services';
import { NgOptimizedImage } from '@angular/common';
import { EmpresaService } from '../../../../services/service-empresas';

@Component({
  selector: 'app-update-logo',
  imports: [NgOptimizedImage],
  templateUrl: './update-logo.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateLogoComponent {
  public readonly loading = signal(false);

  public readonly logoUrl = signal<string | null>(null);

  @Output() public readonly created = new EventEmitter<GeneriResp<any> | null>();

  constructor(
    private cdr: ChangeDetectorRef,
    private readonly emisorService: EmpresaService,
    private readonly notification: NotificationService,
  ) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.isValidFileType(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.logoUrl.set(e.target?.result as string);
          // Forzar la detección de cambios
          this.cdr.detectChanges();
        };
        this.file.set(file);
        reader.readAsDataURL(file);
      } else {
        this.logoUrl.set(null);
        this.notification.push({
          message: 'Tipo de archivo no permitido. Solo se permiten archivos .jpeg y .png',
          type: 'error',
        });
        // Forzar la detección de cambios
        this.cdr.detectChanges();
      }
    }
  }

  public readonly file = signal<File | null>(null);
  private isValidFileType(file: File): boolean {
    const acceptedFileTypes = ['image/jpeg', 'image/png'];
    return acceptedFileTypes.includes(file.type);
  }

  removeLogo(): void {
    this.logoUrl.set(null);
  }

  updateFile(): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.updateLogo(this.file())),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.created.emit(resp);
          this.notification.push({
            message: 'Logo actualizado correctamente.',
            type: 'success',
          });

          this.logoUrl.set(null);
        }
      });
  }
}

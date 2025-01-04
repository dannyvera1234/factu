import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-doc-autorizados',
  imports: [ModalComponent, NgOptimizedImage],
  templateUrl: './doc-autorizados.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocAutorizadosComponent {
  public readonly loading = signal(false);

}

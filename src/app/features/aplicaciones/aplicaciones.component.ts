import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aplicaciones',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './aplicaciones.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AplicacionesComponent {
public readonly loading = signal(false);
}

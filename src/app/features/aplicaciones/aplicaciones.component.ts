import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aplicaciones',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './aplicaciones.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AplicacionesComponent {

}

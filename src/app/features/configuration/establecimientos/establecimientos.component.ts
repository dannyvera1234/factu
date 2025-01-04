import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalComponent } from '@/components';
import { CreateEstablecimientosComponent } from '../create-establecimientos';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-establecimientos',
  imports: [ModalComponent, CreateEstablecimientosComponent, NgOptimizedImage],
  templateUrl: './establecimientos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstablecimientosComponent {

}

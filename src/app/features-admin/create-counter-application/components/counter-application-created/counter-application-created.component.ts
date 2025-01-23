import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateCounterApplicationService } from '../../create-counter-application.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-counter-application-created',
  imports: [NgOptimizedImage, RouterLink],
  template: `<div class="text-center">
    <div class="bg-slate-50 py-4 mb-5">
      <img
        ngSrc="/assets/icon/application-created.svg"
        alt="application created"
        width="242"
        height="242"
        priority
        class="mx-auto"
      />
    </div>
    <h2 class="text-2xl font-bold mb-4">solicitud creada exitosamente</h2>
    <p>
      tu solicitud ha sido creada exitosamente, ahora puedes seguir el estado de tu solicitud en la lista de solicitudes
    </p>
    <button
      routerLink="/sistema_contable_admin/aplicaciones_emisores"
      (click)="formService.reset()"
      class="w-full p-2 bg-secondary block text-white rounded-lg mt-11 cursor-pointer"
    >
      ir a lista de solicitudes
    </button>
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterApplicationCreatedComponent {
  constructor(public readonly formService: CreateCounterApplicationService) {}
}

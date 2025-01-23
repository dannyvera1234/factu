import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-not-count-application',
  imports: [NgOptimizedImage],
  template: `<div class="text-center py-4 max-w-2xl mx-auto">
    <div class="bg-slate-50 py-4 mb-5 rounded-xl">
      <img
        ngSrc="/assets/icon/no-application-found.svg"
        alt="Nothing found"
        width="242"
        height="242"
        priority
        class="mx-auto"
      />
    </div>
    <h3 class="text-2xl font-bold">No hay aplicaciones</h3>
    <p class="text-balance">
      No se encontraron aplicaciones de emisores registradas. Por favor, registre un nuevo emisor.
    </p>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotCountApplicationComponent {}

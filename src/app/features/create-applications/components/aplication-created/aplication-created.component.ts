import { Config } from './../../../../../../node_modules/prettier/index.d';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateApplicationService } from '../../create-applications.service';

@Component({
  selector: 'app-aplication-created',
  imports: [],
  template: `<div class="text-center">
  <div class="bg-slate-50 py-4 mb-5">
    <img
      ngSrc="/assets/icons/bank/bank-created.svg"
      alt="Bank created"
      width="242"
      height="242"
      priority
      class="mx-auto"
    />
  </div>
  <h2 class="text-2xl font-bold mb-4">Bank created successfully!</h2>
  <p>
    Efficiently oversee loans for your clients with streamlined processes and exceptional service. Get started now!
  </p>
  <button (click)="formService.reset()" class="w-full p-2 bg-secondary block text-white rounded-lg mt-11 cursor-pointer">
    View banks list
  </button>
</div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AplicationCreatedComponent {
  constructor(public readonly formService: CreateApplicationService) {}



}

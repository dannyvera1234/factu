import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateCounterApplicationService } from './create-counter-application.service';
import { InfoPersonalComponent, InfoTributariaComponent } from './components';
import { CounterApplicationCreatedComponent } from './components/counter-application-created';

@Component({
  selector: 'app-create-counter-application',
  imports: [NgClass,InfoPersonalComponent, InfoTributariaComponent,CounterApplicationCreatedComponent],
  templateUrl: './create-counter-application.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCounterApplicationComponent {
constructor(public  formService: CreateCounterApplicationService) { }
}

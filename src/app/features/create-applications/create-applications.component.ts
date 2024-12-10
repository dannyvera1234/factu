import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateApplicationService } from './create-applications.service';
import { InfoPersonalComponent, InfoTributariaComponent, PlanesComponent } from './components';

@Component({
  selector: 'app-create-applications',
  imports: [NgClass, InfoPersonalComponent, InfoTributariaComponent, PlanesComponent],
  templateUrl: './create-applications.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateApplicationsComponent {
  constructor(public readonly formService: CreateApplicationService) {}
}

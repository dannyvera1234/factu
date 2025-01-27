import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { PlanesService } from '@/services/service-admin';
import { GeneriResp } from '@/interfaces';
import { CustomDatePipe } from '@/pipes';

@Component({
  selector: 'app-info',
  imports: [CustomDatePipe],
  templateUrl: './info.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  @Input({ required: true }) set idePersonaRol(value: number) {
    this.getInfo(value);
  }

  public readonly infoEmpresa = signal<GeneriResp<any> | null>(null);

  constructor(private readonly planesService: PlanesService) {}

  getInfo(idePersonaRol: number) {
    this.planesService.info(idePersonaRol).subscribe((resp) => {
      if (resp.status === 'OK') {
        this.infoEmpresa.set(resp);
      }
    });
  }
}

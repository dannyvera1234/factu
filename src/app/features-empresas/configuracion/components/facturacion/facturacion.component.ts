import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { GeneriResp } from '../../../../interfaces';
import { UserService } from '../../../../services';
import { HomeService } from '../../../../services/service-empresas';
import { CustomPipe } from '../../../../pipes';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-facturacion',
  imports: [CustomPipe, CurrencyPipe],
  templateUrl: './facturacion.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturacionComponent {

    private readonly user = computed(() => this.userService.getUserData()!.user);
    public readonly infoCard = signal<GeneriResp<any> | null>(null);
    public readonly infoPlan = signal<GeneriResp<any> | null>(null);

    constructor(
      private readonly homeServie: HomeService,
      private readonly userService: UserService,
    ) {
      this.retrievePlan();
    }

    retrievePlan() {
      const idPersonRol = this.user().idPersonRol;
      if (idPersonRol) {
        this.homeServie.retrievePlan(idPersonRol).subscribe((resp) => {
          if (resp.status === 'OK') {
            this.infoPlan.set(resp);
          }
        });
      }
    }


}

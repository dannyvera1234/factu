import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HomeService } from '@/services/service-empresas';
import { UserService } from '@/services';
import { GeneriResp } from '@/interfaces';

import { CustomDatePipe } from '../../pipes';


@Component({
  selector: 'app-home',
  imports: [ CustomDatePipe],
  templateUrl: './home.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly user = computed(() => this.userService.getUserData()!.user);

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

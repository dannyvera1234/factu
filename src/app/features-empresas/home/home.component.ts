import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HomeService } from '@/services/service-empresas';
import { UserService } from '@/services';
import { GeneriResp } from '@/interfaces';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
import { CustomDatePipe } from '../../pipes';

const Color = {
  name: 'customScheme',  // Puedes nombrar tu esquema
  selectable: true,  // Establece si los colores son seleccionables
  group: ScaleType.Ordinal,
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']  // Lista de colores
};
@Component({
  selector: 'app-home',
  imports: [NgxChartsModule, CustomDatePipe],
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
          console.log(resp);
          this.infoPlan.set(resp);
        }
      });
    }
  }

  view: [number, number] = [1300, 400];

  // Definición del esquema de colores
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  barChartResults = [
    { "name": "Ventas Del Dia ", "value": 0 },
    { "name": "Producto Del Mes", "value": 0 },
    { "name": "Cliente Del Mes", "value": 0 },
    { "name": "Ventas Del Mes", "value": 0 },
    { "name": "Producto Mas Vendido", "value": 0 },



  ];
}

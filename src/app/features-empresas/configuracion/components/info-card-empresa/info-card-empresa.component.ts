import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { HomeService } from '@/services/service-empresas';
import { UserService } from '@/services';
import { CustomDatePipe } from '@/pipes';
interface InfoCardData {
  totalClientes: number;
  totalDocAutorizados: number;
  totalProductos: number;
  ventasDiarias: number;
  ventasMensual: number;
}
@Component({
  selector: 'app-info-card-empresa',
  imports: [CustomDatePipe],
  templateUrl: './info-card-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardEmpresaComponent {
  private readonly user = computed(() => this.userService.getUserData()!.user);
  public readonly infoCard = signal<GeneriResp<InfoCardData> | null>(null);
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


  stats: { title: string; key: any; color: string; icon: string }[] = [
    {
      title: 'Ventas Diarias',
      key: 'ventasDiarias',
      color: 'bg-blue-100',
      icon: '/assets/icon/sale-daily.svg',
    },
    {
      title: 'Ventas Mensuales',
      key: 'ventasMensual',
      color: 'bg-green-100',
      icon: '/assets/icon/sales-monthy.svg',
    },
    {
      title: 'Productos Registrados',
      key: 'totalProductos',
      color: 'bg-yellow-100',
      icon: '/assets/icon/products.svg',
    },
    {
      title: 'Clientes Registrados',
      key: 'totalClientes',
      color: 'bg-orange-100',
      icon: '/assets/icon/perfil.svg',
    },
    {
      title: 'Documentos Autorizados',
      key: 'totalDocAutorizados',
      color: 'bg-red-100',
      icon: '/assets/icon/documents.svg',
    },
  ];

  getStatValue(key: keyof InfoCardData): string | number {
    const value = this.infoCard()?.data?.[key] ?? 0;

    if (key === 'ventasDiarias' || key === 'ventasMensual') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    return value;
  }
}

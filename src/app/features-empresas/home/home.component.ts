import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ConfiguracionService } from '@/services/service-empresas';
import { GeneriResp } from '@/interfaces';
import { DetailsService } from '../../feature-counters/details-counter-application';
import { NgClass } from '@angular/common';

interface InfoCardData {
  totalClientes: number;
  totalDocAutorizados: number;
  totalProductos: number;
  ventasDiarias: number;
  ventasMensual: number;
}

@Component({
  selector: 'app-home',
  imports: [NgClass],
  templateUrl: './home.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public readonly infoPlan = signal<GeneriResp<any> | null>(null);
  public readonly card = computed(() => this.detailsService.info());
  public readonly infoCard = signal<GeneriResp<InfoCardData> | null>(null);

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

  constructor(
    private readonly configuracionService: ConfiguracionService,
    private readonly detailsService: DetailsService,
  ) {
    this.detailsHome();
  }

  detailsHome(): void {
    this.configuracionService.detailsHome().subscribe((response) => {
      if (response.status === 'OK') {
        this.infoCard.set(response);
      }
    });
  }
}

import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CountersService } from '../../../../services/counters.service';
import { GeneriResp } from '../../../../interfaces';
import { NgClass } from '@angular/common';
interface InfoCardData {
  totalClientes: number;
  totalDocAutorizados: number;
  totalProductos: number;
  ventasDiarias: number;
  ventasMensual: number;
}

@Component({
  selector: 'app-info-card',
  imports: [NgClass],
  templateUrl: './info-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent {
  @Input({ required: true }) set personaRolIde(value: number) {
    this.detailsHome(value);
  }

  public readonly infoCard = signal<GeneriResp<InfoCardData> | null>(null);

  stats: { title: string; key: any; color: string; icon: string }[] = [
    {
      title: 'Ventas Diarias',
      key: 'ventasDiarias',
      color: 'blue',
      icon: '/assets/icon/sale-daily.svg',
    },
    {
      title: 'Ventas Mensuales',
      key: 'ventasMensual',
      color: 'green',
      icon: '/assets/icon/sales-monthy.svg',
    },
    {
      title: 'Productos Registrados',
      key: 'totalProductos',
      color: 'yellow',
      icon: '/assets/icon/products.svg',
    },
    {
      title: 'Clientes Registrados',
      key: 'totalClientes',
      color: 'orange',
      icon: '/assets/icon/perfil.svg',
    },
    {
      title: 'Documentos Autorizados',
      key: 'totalDocAutorizados',
      color: 'red',
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

  constructor(private readonly counterService: CountersService) {}

  detailsHome(personaRolIde: number): void {
    this.counterService.detailsHome(personaRolIde).subscribe((response) => {
      if (response.status === 'OK') {
        this.infoCard.set(response);
      }
    });
  }
}

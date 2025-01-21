import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { CountersService } from '../../../../services/counters.service';
import { GeneriResp } from '../../../../interfaces';
import { NgClass } from '@angular/common';
import { DetailsService } from '../../details.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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

  public readonly card = computed(() => this.detailsService.info());

  constructor(
    private readonly counterService: CountersService,
    private readonly detailsService: DetailsService,
  ) {
    toObservable(this.card)
      .pipe(takeUntilDestroyed())
      .subscribe((info) => {
        const personaRolIde = info?.personaRolIde;
        if (personaRolIde) {
          this.detailsHome(personaRolIde);
        }
      });
  }

  detailsHome(personaRolIde: number): void {
    this.counterService.detailsHome(personaRolIde).subscribe((response) => {
      if (response.status === 'OK') {
        console.log(response);
        this.infoCard.set(response);
      }
    });
  }
}

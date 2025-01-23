import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { NgClass } from '@angular/common';
import { ConfiguracionService } from '@/services/service-empresas';
import { DetailsService } from '@/feature-counters/details-counter-application';
interface InfoCardData {
  totalClientes: number;
  totalDocAutorizados: number;
  totalProductos: number;
  ventasDiarias: number;
  ventasMensual: number;
}
@Component({
  selector: 'app-info-card-empresa',
  imports: [NgClass],
  templateUrl: './info-card-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardEmpresaComponent {
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
    private readonly configuracionService: ConfiguracionService,
    private readonly detailsService: DetailsService,
  ) {
    this.detailsHome();

    toObservable(this.card)
      .pipe(
        takeUntilDestroyed(),
        tap(() => this.infoCard.set(null)),
      )
      .subscribe((info) => {
        const personaRolIde = info?.personaRolIde;
        if (personaRolIde) {
          this.detailsHome();
          this.detailsService.info.set(null);
        }
      });
  }

  detailsHome(): void {
    this.configuracionService.detailsHome().subscribe((response) => {
      if (response.status === 'OK') {
        this.infoCard.set(response);
      }
    });
  }
}

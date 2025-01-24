import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterCounteWebService } from '../../services/register-counte-web.service';
import { GeneriResp } from '../../interfaces';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-pega-informative',
  imports: [RouterLink, NgClass, CurrencyPipe],
  templateUrl: './pega-informative.component.html',
  styles: `
    html {
      scroll-behavior: smooth;
    }
    .swiper {
      width: 100%;
      height: 100%;
    }

    .swiper-slide {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    }

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px; /* Espacio entre el título y el contenido */
    }

    .plans {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 20px;
      flex-wrap: wrap;
    }

    .plan {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 45%; /* Dos planes por slide */
      text-align: left;
    }

    .plan h3 {
      font-size: 1.2rem;
      margin-bottom: 10px;
      color: #2a9d8f; /* Color para los títulos de los planes */
    }

    .plan p {
      font-size: 0.9rem;
      color: #666;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PegaInformativeComponent {
  selectedPlan: string | null = null;

  isMenuOpen = false;

  public readonly plan = signal<GeneriResp<any[]> | null>(null);

  public readonly loanding = signal(false);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Función para seleccionar un plan
  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }
  constructor(private readonly planesService: RegisterCounteWebService) {
    this.planes();
  }

  planes() {
    of(this.loanding.set(true)).pipe(
      mergeMap(() => this.planesService.planes()),
      finalize(() => this.loanding.set(false))
    ).subscribe((resp:any) => {
      if (resp.status === 'OK') {
        this.plan.set(resp);
        console.log(this.plan());
      }

    });
  }

}

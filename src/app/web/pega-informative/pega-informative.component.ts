import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';

@Component({
  selector: 'app-pega-informative',
  imports: [RouterLink],
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
export class PegaInformativeComponent implements AfterViewInit {
  selectedPlan: string | null = null;

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Función para seleccionar un plan
  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }
  ngAfterViewInit(): void {
    // Inicializa Swiper después de que la vista esté lista
    const swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}

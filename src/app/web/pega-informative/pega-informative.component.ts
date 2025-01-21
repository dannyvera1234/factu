import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pega-informative',
  imports: [RouterLink, NgClass],
  templateUrl: './pega-informative.component.html',
  styles: `
  html {
  scroll-behavior: smooth;
}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PegaInformativeComponent {
  selectedPlan: string | null = null;

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Función para seleccionar un plan
  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }
}

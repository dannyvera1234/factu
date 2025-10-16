import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadingRedirectService } from '../../shared/services/loading-redirect.service';

@Component({
  selector: 'app-heard',
  imports: [NgClass, RouterLink],
  templateUrl: './heard.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeardComponent {
  menuOpen = false;
  private loadingService = inject(LoadingRedirectService);

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToLogin() {
    console.log('goToLogin called');
    // Limpiar datos antiguos del localStorage
    localStorage.removeItem('UserData');
    this.loadingService.show('/login');
  }
}

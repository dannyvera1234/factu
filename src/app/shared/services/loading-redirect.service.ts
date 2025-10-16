import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingRedirectService {
  private router = inject(Router);

  public isVisible = signal(false);
  public message = signal('Cargando...');

  show(redirectTo: string) {
    this.message.set('Redirigiendo...');
    this.isVisible.set(true);

    setTimeout(() => {
      this.router.navigate([redirectTo]).then((success) => {
        setTimeout(() => this.isVisible.set(false), 300);
      }).catch((error) => {
        this.isVisible.set(false);
      });
    }, 2000);
  }

  hide() {
    this.isVisible.set(false);
  }
}

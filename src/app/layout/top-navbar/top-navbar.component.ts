import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserService } from '../../services';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-top-navbar',
  imports: [ClickOutsideDirective],
  templateUrl: './top-navbar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavbarComponent {
  private userService = inject(UserService);
  public showProfileMenu = signal(false);
  public showSearchDropdown = signal(false);

  toggleProfileMenu() {
    this.showProfileMenu.set(!this.showProfileMenu());
  }

  hideSearchDropdown() {
    setTimeout(() => this.showSearchDropdown.set(false), 150);
  }

  addNewAppointment() {
    this.showSearchDropdown.set(false);
    console.log('Agregar nueva cita');
    // Aquí iría la lógica para agregar nueva cita
  }

  addNewPatient() {
    this.showSearchDropdown.set(false);
    console.log('Agregar nuevo paciente');
    // Aquí iría la lógica para agregar nuevo paciente
  }

  logout() {
    this.userService.logout();
  }

  getUserName() {
    const userData = this.userService.getUserData();
    return userData?.user?.name || 'Usuario';
  }

  getCurrentDate() {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  closeAllMenus() {
    this.showProfileMenu.set(false);
    this.showSearchDropdown.set(false);
  }
}
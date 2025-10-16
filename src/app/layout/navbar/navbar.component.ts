import { NgClass, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { ModalService } from '../../utils/services/modal.service';
import { NuevoPacienteComponent } from '../../features-dental/pacientes/components/nuevo-paciente/nuevo-paciente.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, ClickOutsideDirective, NuevoPacienteComponent, ],
  templateUrl: './navbar.component.html',
  styles: `
    .navbar-item {
      display: flex;
      align-items: center;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private userService = inject(UserService);
  private modalService = inject(ModalService);
  public showMobileMenu = signal(false);
  public activeSubmenu = signal<number | null>(null);
  public showNewPatientModal = signal(false);

  public readonly userData = computed(() => {
    const data = this.userService.getUserData();
    if (data && data.permission.length > 0) {
      return data.permission[0].modules.sort((a: any, b: any) => a.order - b.order);
    }
    return [];
  });

  toggleMobileMenu() {
    this.showMobileMenu.set(!this.showMobileMenu());
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  getActiveUsers() {
    return 3; // Número de usuarios activos
  }

  // Método temporal para limpiar localStorage y forzar actualización
  clearUserData() {
    localStorage.removeItem('UserData');
    console.log('UserData cleared - please login again to see new modules');
    // Recargar la página para forzar re-login
    window.location.reload();
  }

  toggleSubmenu(moduleId: number) {
    if (this.activeSubmenu() === moduleId) {
      this.activeSubmenu.set(null);
    } else {
      this.activeSubmenu.set(moduleId);
    }
  }

  isSubmenuOpen(moduleId: number) {
    return this.activeSubmenu() === moduleId;
  }

  getIconPath(iconName: string) {
    return `assets/icons/${iconName}.svg`;
  }

  closeAllMenus() {
    this.activeSubmenu.set(null);
    this.showMobileMenu.set(false);
  }

  openModal() {
    this.showNewPatientModal.set(true);
    document.body.classList.add('overflow-hidden');
  }

  closeModal() {
    this.showNewPatientModal.set(false);
    document.body.classList.remove('overflow-hidden');
  }

  onPatientSaved() {
    this.showNewPatientModal.set(false);
    document.body.classList.remove('overflow-hidden');
  }
}

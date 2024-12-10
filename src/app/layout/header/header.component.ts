import { DOCUMENT, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject } from '@angular/core';
// import { AuthService } from '@auth0/auth0-angular';

// import { CustomPhoneCallerComponent, UserNotificationsComponent } from '@/components';
// import { TextInitialsPipe } from '@/pipes';
// import { MeService } from '@/services';
// import { Permissions, SidebarService, UserPermissionsService } from '@/utils';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // public readonly closeSidebar = computed(() => this.sidebar.closeSidebar());

  // public readonly user = computed(() => this.meService.user());

  public readonly permission = Permissions;

  constructor(
    // private readonly sidebar: SidebarService,
    @Inject(DOCUMENT) public document: Document,
    // public auth: AuthService,
    // private meService: MeService,
    // public readonly permissions: UserPermissionsService,
  ) {}

  public toggle(): void {
    // this.sidebar.closeSidebar.set(!this.sidebar.closeSidebar());
  }
}

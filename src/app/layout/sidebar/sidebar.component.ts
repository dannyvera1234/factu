import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '@/utils/services';

import { routes } from '@/app.routes';


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgClass,NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public readonly closeSidebar = computed(() => this.sidebar.closeSidebar());

  constructor(private readonly sidebar: SidebarService) {}

   routes = routes[0].children!.filter((route) => {
    return (
       route?.data &&
       route?.data['name'] &&
       route?.data['icon']
      //  (route?.data['permissions'] ? hasPermission(route?.data['permissions']) : true)
     );
   });

  public toggle(): void {
    this.sidebar.closeSidebar.set(!this.sidebar.closeSidebar());
  }
}

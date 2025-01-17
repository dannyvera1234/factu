import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '@/utils/services';
import { UserService } from '../../services';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public readonly closeSidebar = computed(() => !this.sidebar.closeSidebar());
  icons: string[] = [];
  constructor(
    public userService: UserService,
    private readonly sidebar: SidebarService,
  ) {}

  public readonly userData = computed(() => {
    const data = this.userService.getUserData();
    console.log(data);
    return data && data.permission.length > 0 ? data.permission[0].modules : [];
  });

  public toggle(): void {
    this.sidebar.closeSidebar.set(!this.sidebar.closeSidebar());
  }
}

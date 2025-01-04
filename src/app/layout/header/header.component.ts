import { DOCUMENT, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, Inject, signal } from '@angular/core';
import { SidebarService } from '../../utils/services';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services';
import { TextInitialsPipe } from '../../pipes';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, NgOptimizedImage, TextInitialsPipe],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as HTMLElement);
    if (!clickedInside) {
      this.isDropdownOpen.set(false);
    }
  }

  public readonly closeSidebar = computed(() => this.sidebar.closeSidebar());

  public readonly userData = computed(() => {
    const data = this.userService.getUserData();
    return data ? data.user : null;
  });

  public isDropdownOpen = signal(false);

  public readonly permission = Permissions;

  constructor(
    private readonly sidebar: SidebarService,
    @Inject(DOCUMENT) public document: Document,
    private elementRef: ElementRef,
    public userService: UserService,
  ) {}

  public toggle(): void {
    this.sidebar.closeSidebar.set(!this.sidebar.closeSidebar());
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  public logout(): void {
    this.userService.logout();
  }
}

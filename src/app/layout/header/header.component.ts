import { DOCUMENT, NgClass} from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, Inject, signal } from '@angular/core';
import { SidebarService } from '../../utils/services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink],
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

   public isDropdownOpen = signal(false);

  public readonly permission = Permissions;

  constructor(
    private readonly sidebar: SidebarService,
    @Inject(DOCUMENT) public document: Document,
    private elementRef: ElementRef
  ) {}

  public toggle(): void {
     this.sidebar.closeSidebar.set(!this.sidebar.closeSidebar());
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }


}

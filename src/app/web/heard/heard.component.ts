import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-heard',
  imports: [NgClass, RouterLink],
  templateUrl: './heard.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeardComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}

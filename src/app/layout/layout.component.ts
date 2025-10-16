import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer';

import { ModalOutletComponent } from '../components';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-layout',
  imports: [ FooterComponent, RouterOutlet, ModalOutletComponent, TopNavbarComponent,NavbarComponent],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}

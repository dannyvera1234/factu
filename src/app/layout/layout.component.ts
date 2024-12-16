import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { SidebarComponent } from './sidebar';
import { ModalOutletComponent } from '../components';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet, ModalOutletComponent],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}

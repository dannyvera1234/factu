import { Component } from '@angular/core';
import { LayoutComponent } from './layout';

@Component({
  selector: 'app-root',
  imports: [ LayoutComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'factu';
}

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [NgClass],
  templateUrl: './filter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {
  public readonly open = signal(false);

  @HostListener('document:click', ['$event.target'])
  onClick(btn: any) {
    if (this.open() && !this.ref.nativeElement.contains(btn)) {
      this.open.set(false);
      // this.form.reset();
    }
  }

  constructor(private readonly ref: ElementRef) { }
}

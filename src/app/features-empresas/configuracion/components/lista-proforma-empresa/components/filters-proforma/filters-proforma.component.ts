import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-proforma',
  imports: [NgClass, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './filters-proforma.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersProformaComponent {
  public readonly open = signal(false);

  @HostListener('document:click', ['$event.target'])
  onClick(btn: any) {
    if (this.open() && !this.ref.nativeElement.contains(btn)) {
      this.open.set(false);
    }
  }

  constructor(private readonly ref: ElementRef, private readonly _fb: FormBuilder) {}

  form  = this._fb.group({});
}

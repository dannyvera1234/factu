import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormErrorMessageComponent } from './form-error-message.component';
import { InputErrorLocatorService } from '@/utils/services';

@Component({
  selector: 'app-custom-input',
  imports: [NgClass, FormErrorMessageComponent],
  template: `<div [class]="groupClass">
    <div class="relative">
      <label [for]="id ?? control.name" class="absolute left-0 top-[-25px]  font-medium text-gray-700">
      {{ label.split('*')[0] }}

        @if (label.includes('*')) {
          <span class="text-red-500">*</span>
        }
      </label>

      @if (prefix(); as prefix) {
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          {{ prefix }}
        </span>
      }

      <input
        [id]="id ?? control.name"
        [name]="control.name"
        [type]="type"
        [min]="min"
        [accept]="accept"
        [placeholder]="placeholder"
        [ngClass]="
          'peer w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none text-gray-600 p-2 ' +
          inputClass +
          (prefix() ? 'pl-10' : 'pl-3')
        "
        [readonly]="readonly"
        [autocomplete]="autocomplete"
        [value]="value"
        (input)="change($event)"
        (blur)="control.control?.markAsTouched()"
        [disabled]="this.control.control?.disabled ?? false"
      />
    </div>
    <app-form-error-message [control]="control.control!" />
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements ControlValueAccessor, OnInit {
  @Input() type: string = 'text';

  @Input() readonly = false;

  @Input() accept = '';

  @Input() label = '';

  @Input() placeholder = '';

  @Input() inputClass = '';

  @Input() groupClass = '';

  @Input() min = '';

  @Input() max = '';

  @Input() autocomplete = 'off';

  @Input() pattern: any;

  @Input() id: string | undefined;

  @Input() subLabel = '';

  prefix = input<string | null>(null);

  public value: any;

  constructor(
    public control: NgControl,
    public readonly errorLocator: InputErrorLocatorService,
    public readonly _cd: ChangeDetectorRef,
  ) {
    this.control.valueAccessor = this;
  }

  touched = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {};

  onTouched = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  ngOnInit(): void {
    const originalMarkAsTouched = this.control.control!.markAsTouched.bind(this.control.control);
    this.control.control!.markAsTouched = () => {
      originalMarkAsTouched();
      this.touched.set(true);
      this._cd.markForCheck();
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
    this._cd.markForCheck();
  }

  public change(event: any) {
    this.control.control?.markAsTouched();
    this.value = event.target.value;
    this.onChange(event.target.value);
  }
}

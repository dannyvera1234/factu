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
      @if (prefix(); as prefix) {
        <span class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-600">{{
          prefix
        }}</span>
      }
      <input
        [id]="id ?? control.name"
        [name]="control.name"
        [type]="type"
        [min]="min"
        [accept]="accept"
        [placeholder]="placeholder"
        [ngClass]="
          'peer w-full border-b-2 border-gray-300 focus:border-secondary outline-none text-gray-600 py-2 ' +
          inputClass +
          (prefix() ? 'ps-6' : '')
        "
        [class]="inputClass"
        [readonly]="readonly"
        [autocomplete]="autocomplete"
        [value]="value"
        (input)="change($event)"
        (blur)="control.control?.markAsTouched()"
        [min]="min"
        [max]="max"
        [pattern]="pattern"
        [disabled]="this.control.control?.disabled ?? false"
      />

      @if (label) {
        <label
          [for]="id ?? control.name"
          class="absolute left-0 -top-3.5 text-gray-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-secondary"
          [ngClass]="prefix() ? 'left-6' : 'left-0'"
        >
          {{ label }}</label
        >
        <span class="label-text-alt text-gray-400">
          {{ subLabel }}
        </span>
      }
    </div>
    <app-form-error-message [control]="control.control!" />
  </div>`,
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

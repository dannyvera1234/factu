import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, Input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';

import { FormErrorMessageComponent } from './form-error-message.component';
import { InputErrorLocatorService } from '../../utils/services';

@Component({
  selector: 'app-custom-select',
  imports: [NgClass, FormErrorMessageComponent, FormsModule, FormErrorMessageComponent],
  template: `
    <div class="relative">
      <label [for]="name" class="absolute left-0 top-[-25px] font-medium text-gray-700">
        {{ label.split('*')[0] }}

        @if (label.includes('*')) {
          <span class="text-red-500">*</span>
        }
      </label>

      <!-- Prefix (si existe) -->
      @if (prefix(); as prefix) {
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          {{ prefix }}
        </span>
      }
      <select
        [ngClass]="
          'peer w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none text-gray-600 p-2 ' +
          concatInputClass() +
          (prefix() ? ' pl-10' : ' pl-3')
        "
        [(ngModel)]="value"
        (blur)="control.control?.markAsTouched()"
        (ngModelChange)="change()"
        [disabled]="this.control.control?.disabled ?? false"
      >
        @if (placeholder) {
          <option value="" [selected]="true">{{ placeholder }}</option>
        }
        @for (item of options; track $index) {
          <option [ngClass]="optionClass" [value]="item">{{ labels ? labels[$index] : item }}</option>
        }
      </select>
    </div>

    @if (touched()) {
      <app-form-error-message [control]="control.control!" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectComponent implements ControlValueAccessor, OnInit {
  @Input({ required: true }) options: (string | number)[] = [];

  @Input() labels: string[] | null = null;

  @Input() name = '';

  @Input() label = '';

  @Input() placeholder = '';

  @Input() labelClass = '';

  @Input() optionClass = '';

  @Input() inputClass = '';

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

  public change() {
    this.control.control?.markAsTouched();
    this.onChange(this.value);
  }

  concatInputClass(): string {
    return `${this.inputClass} ${this.control.invalid && this.touched() ? 'is-invalid' : ''}`;
  }
}

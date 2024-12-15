import { ChangeDetectionStrategy, Component, input, OnChanges, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CustomInputComponent,
  FileHandlerComponent,
  FilePickerComponent,
  FormErrorMessageComponent,
} from '@/components';
import { ObjectId } from '@/utils/built-in/generate-id';
import { DraftDocument } from '@/interfaces';

@Component({
  selector: 'app-document-picker',
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    FilePickerComponent,
    FileHandlerComponent,
    FormErrorMessageComponent,
  ],
  templateUrl: './document-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  public readonly seed = ObjectId();

  public value: DraftDocument | null = null;

  public readonly withCertifactePassword = input<boolean>(true);

  public readonly form = this._fb.group({
    certificatePassword: [null as null | string],
    file: [null as null | File, [Validators.required]],
  });

  constructor(
    public control: NgControl,
    private readonly _fb: FormBuilder,
  ) {
    this.control.valueAccessor = this;

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.writeValue(value as DraftDocument);
      this.onChange(value);
    });
  }

  ngOnChanges(): void {
    this.setValidators();
  }

  ngOnInit(): void {
    this.setValidators();
    const originalMarkAsTouched = this.control.control!.markAsTouched.bind(this.control.control);
    this.control.control!.markAsTouched = () => {
      this.form.markAllAsTouched();
      originalMarkAsTouched();
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (event: any) => {};

  onTouched = () => {};

  writeValue(value: DraftDocument | null): void {
    this.value = value ?? this.value;
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public addFile(files: File[]): void {
    const file = files.at(0);
    if (!file) {
      return;
    }

    this.form.controls.file.setValue(file);
  }

  public removeFile(): void {
    this.form.controls.file.reset();
  }

  setValidators() {
    const certficado = [Validators.required];
    if (this.withCertifactePassword()) {
      this.form.controls.certificatePassword.addValidators(certficado);
      this.form.controls.certificatePassword.enable();
    } else {
      this.form.controls.certificatePassword.removeValidators(certficado);
      this.form.controls.certificatePassword.disable();
    }
  }
}

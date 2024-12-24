import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DocumentPickerComponent } from '@/components';
import { NgClass } from '@angular/common';

type StatementType = {
  certificatePassword?: string;
  file?: File | null;
};

@Component({
  selector: 'app-create-file',
  imports: [ReactiveFormsModule, DocumentPickerComponent, NgClass],
  templateUrl: './create-file.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFileComponent {
  @Output() public readonly fileCreate = new EventEmitter<any | null>();
  public readonly loading = signal(false);

  constructor(private readonly _fb: FormBuilder) {}

  public readonly form = this._fb.group({
    statement: this._fb.control<StatementType | null>(null),
  });

  public submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}

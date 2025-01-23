import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '@/utils/services';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DocumentPickerComponent } from '@/components';
import { EmpresaService } from '@/services/service-empresas';
type StatementType = {
  certificatePassword?: string;
  file?: File | null;
};
@Component({
  selector: 'app-create-file',
  imports: [ReactiveFormsModule, NgClass, DocumentPickerComponent],
  templateUrl: './create-file.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFileComponent {
  public readonly files = signal<File | null>(null);

  @Output() public readonly fileCreate = new EventEmitter<any | null>();

  public readonly loading = signal(false);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly emisorService: EmpresaService,
    private readonly notification: NotificationService,
  ) {}

  public readonly form = this._fb.group({
    statement: this._fb.control<StatementType | null>(null, Validators.required),
  });

  private collectFiles(): void {
    const statementControl = this.form.controls.statement.value;

    if (statementControl?.file) {
      this.files.set(statementControl.file);
    }
  }

  public submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.collectFiles();
    const infoFile = {
      certificatePassword: this.form.value.statement?.certificatePassword,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.createFile(infoFile, this.files())),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.fileCreate.emit(resp.data);
          this.notification.push({
            message: 'Archivo subido correctamente.',
            type: 'success',
          });
        }
      });
  }
}

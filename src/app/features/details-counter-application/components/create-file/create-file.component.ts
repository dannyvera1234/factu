import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentPickerComponent } from '@/components';
import { NgClass } from '@angular/common';
import { of, mergeMap, finalize } from 'rxjs';
import { CountersService } from '@/services/counters.service';
import { NotificationService } from '../../../../utils/services';

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
  @Input({ required: true }) idePersonaRol!: number;
  public readonly files = signal<File | null>(null);

  @Output() public readonly fileCreate = new EventEmitter<any | null>();

  public readonly loading = signal(false);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly counterService: CountersService,
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
      personaRolIde: this.idePersonaRol,
      certificatePassword: this.form.value.statement?.certificatePassword,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.createDoc(infoFile, this.files())),
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

import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from '@/components';
import { mergeMap, of, finalize } from 'rxjs';
import { ProveedorService } from '@/services/service-empresas';
import { NotificationService } from '@/utils/services';
import { cedulaValidator, emailValidator } from '@/utils/validators';

@Component({
  selector: 'app-registro-proveedor',
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './registro-proveedor.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroProveedorComponent implements OnInit {
  @Output() public readonly agregarRegistro = new EventEmitter<any | null>();

  proveedorForm!: FormGroup;

  public readonly loandig = signal(false);

  constructor(
    private fb: FormBuilder,
    private readonly notification: NotificationService,
    private readonly proveedorService: ProveedorService,
  ) {}
  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      socialReason: ['', Validators.required],
      identificationNumber: [
            '',
            [Validators.required, cedulaValidator(), Validators.maxLength(13), Validators.minLength(13)],
          ],
      typeDocument: ['04', Validators.required],
      email: ['', [Validators.required, emailValidator()]],
      cellPhone: ['09', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', Validators.required],
    });
  }

  public onUsernameInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.proveedorForm.get([sourceField]);

    if (control) {
      control.setValue(newValue);
    }
  }

  saveProveedor() {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }
    const data = this.proveedorForm.value;

    of(this.loandig.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.saveProveedor(data)),
        finalize(() => this.loandig.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          console.log(res);
          this.agregarRegistro.emit({
            proveedorIde:res.data,
            ...data
          });
          this.notification.push({
            message: 'Proveedor creado correctamente',
            type: 'success',
          });
        }
      });
  }
}

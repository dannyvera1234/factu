import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { cedulaValidator, emailValidator } from '../../utils/validators';
import { RegisterCounteWebService } from '../../services/register-counte-web.service';
import { finalize, mergeMap, of } from 'rxjs';
import { FormErrorMessageComponent } from '../../components';

@Component({
  selector: 'app-registro-contadores',
  imports: [RouterLink, ReactiveFormsModule, FormErrorMessageComponent],
  templateUrl: './registro-contadores.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroContadoresComponent {
  public readonly loanding = signal(false);

  public readonly confirmarRegistro = signal(false);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly registeCounter: RegisterCounteWebService,
    private router: Router,
  ) {}

  form = this._fb.group({
    typePerson: null,
    socialReason: null,
    names: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    typeDocument: ['05'],
    identificationNumber: [
      '',
      [Validators.required, cedulaValidator(), Validators.maxLength(10), Validators.minLength(10)],
    ],
    email: ['', [Validators.required, emailValidator()]],
    cellPhone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    dateBirth: null,
    amountCustomer: 1,
  });

  public onUsernameInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.form.get(sourceField);

    if (control) {
      control.setValue(newValue);
    }
  }

  public onletterInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    // Permitir solo letras y espacios
    const newValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

    // Actualizar el valor del campo de entrada en el DOM
    event.target.value = newValue;

    // Obtener el control asociado en el formulario reactivo
    const control = this.form.get(sourceField);

    if (control) {
      // Actualizar el valor del control en el formulario reactivo
      control.setValue(newValue);
    }
  }

  onInput(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && control.dirty : false;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Formulario invalido');
      return;
    }

    of(this.loanding.set(true))
      .pipe(
        mergeMap(() => this.registeCounter.registerCounterWeb(this.form.value)),
        finalize(() => this.loanding.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.confirmarRegistro.set(true);
        }
      });
  }

  login() {
    this.confirmarRegistro.set(false);
    this.router.navigate(['/login']);
  }
}

import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator, onlyNumbersValidator } from '@/utils/validators';
import { finalize } from 'rxjs';
import { ApplicationService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class CreateApplicationService {
  public readonly steps: string[] = ['Información Personal', 'Información Tributaria', 'Planes'];

  public readonly currentStep = signal(2);

  public readonly submitting = signal(false);

  public readonly created = signal(false);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly applicationService: ApplicationService,
  ) {}

  public form = this._fb.group({
    step_1: this._fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      emails: this._fb.array<FormGroup<{ email: FormControl<string | null> }>>(
        [
          this._fb.group({
            email: ['', [Validators.required, emailValidator()]],
          }),
        ],
        [Validators.required],
      ),
      phones: this._fb.array<FormGroup<{ phone: FormControl<any | null> }>>([
        this._fb.group({ phone: [null, [Validators.required, onlyNumbersValidator(), Validators.maxLength(10)]] }),
      ]),
      identificacion: ['', [Validators.required]],
      tipo_documento: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
    }),
    step_2: this._fb.group({
      razon_social: ['', [Validators.required]],
      // ruc: ['', [Validators.required]],
      // tipo_contribuyente: ['', [Validators.required]],
      nombre_comercial: ['', [Validators.required]],
      direccion_matriz: ['', [Validators.required]],
      establecimiento: ['', [Validators.required]],
      rimpe: ['', [Validators.required]],
    }),
  });

  public prev(): void {
    this.currentStep.set(Math.max(this.currentStep() - 1, 0));
  }


  public next(): void {
    const nextStep = this.currentStep() + 1;
    if (nextStep <= this.steps.length - 1) {
      return this.currentStep.set(nextStep);
    }

    this.submit();
  }

  private submit(): void {
    this.submitting.set(true);

    this.applicationService
      .createApplication()
      // .pipe(finalize(() => this.submitting.set(false)))
      // .subscribe(() => {
      //   this.created.set(true);
        // this.searchService.search.set(SearchModel.EMPTY);
      // });
  }

  public reset() {
    this.currentStep.set(0);
    this.created.set(false);
    this.form.reset();
  }

}

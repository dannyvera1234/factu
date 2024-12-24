import { Injectable, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ageValidator, emailValidator, onlyLettersValidator, onlyNumbersValidator } from '@/utils/validators';
import { CreateApplication } from '@/interfaces';
import { finalize } from 'rxjs';
import { CountersService } from '../../services/counters.service';
type StatementType = {
  certificatePassword?: string;
  file?: File | null;
};

@Injectable({
  providedIn: 'root',
})
export class CreateCounterApplicationService {
  public readonly steps: string[] = ['Información Personal', 'Información Tributaria'];

  public readonly currentStep = signal(1);

  public readonly submitting = signal(false);

  public readonly created = signal(false);

  public readonly files = signal<File | null>(null);

  public readonly form;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly applicationService: CountersService,
  ) {
    this.form = this._fb.group({
      step_1: this._fb.group({
        names: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()]],
        lastName: [
          '',
          [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()],
        ],
        typeDocument: ['', [Validators.required]],
        identificationNumber: ['', [Validators.required]],
        email: ['', [Validators.required, emailValidator()]],
        cellPhone: [
          '09',
          [Validators.required, onlyNumbersValidator(), Validators.maxLength(10), Validators.minLength(10)],
        ],
        dateBirth: ['', [ageValidator()]],
      }),
      step_2: this._fb.group({
        typePerson: ['', [Validators.required]],
        razon_social: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
        mainAddress: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
        comercialName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
        retentionAgent: [''],
        specialContributor: ['', [Validators.maxLength(50)]],
        requiredAccounting: [false],
        rimpe: [false],
        rimpePopular: [false],
        code: ['001', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyNumbersValidator()]],
        electronicDocuments: this._fb.control({ value: false, disabled: false }),
        statement: this._fb.control<StatementType | null>(null),
        environmentCode: ['1', [Validators.required]],
      }),
      step_3: this._fb.group({
        planIde: [null, [Validators.required]],
      }),
    });

    this.form.controls.step_2.controls.statement.disable();
  }

  public onUsernameInput(event: any, sourceStep: string, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.form.get([sourceStep, sourceField]);

    if (control) {
      control.setValue(newValue);
    }
  }

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

  private collectFiles(): void {
    const step2 = this.form.controls.step_2;
    const statementControl = step2.controls.statement.value as StatementType;

    if (statementControl?.file) {
      this.files.set(statementControl.file);
    }
  }

  private mapFormToApplication(): CreateApplication {
    const step1 = this.form.controls.step_1;
    const step2 = this.form.controls.step_2;

    return {
      typePerson: step2.controls.typePerson.value?.trim(),
      socialReason: step2.controls.razon_social.value?.trim(),
      names: step1.controls.names.value?.trim(),
      lastName: step1.controls.lastName.value?.trim(),
      typeDocument: step1.controls.typeDocument.value?.trim(),
      identificationNumber: step1.controls.identificationNumber.value?.trim(),
      email: step1.controls.email.value?.trim(),
      cellPhone: step1.controls.cellPhone.value?.trim(),
      dateBirth: step1.controls.dateBirth.value?.trim(),
      infoEmisor: {
        ruc: step1.controls.identificationNumber.value?.trim(),
        environmentCode: step2.controls.environmentCode.value?.trim(),
        mainAddress: step2.controls.mainAddress.value?.trim(),
        comercialName: step2.controls.comercialName.value?.trim(),
        requiredAccounting: step2.controls.requiredAccounting.value?.valueOf(),
        rimpe: step2.controls.rimpe.value?.valueOf(),
        retentionAgent: step2.controls.retentionAgent.value?.trim(),
        rimpePopular: step2.controls.rimpePopular.value?.valueOf(),
        specialContributor: step2.controls.specialContributor.value?.trim(),
        certificatePassword: step2?.controls?.statement?.value?.certificatePassword,
      },
      subsidiary: {
        code: step2.controls.code.value?.trim(),
        email: step1.controls.email.value?.trim(),
        address: step2.controls.mainAddress.value?.trim(),
        cellPhone: step1.controls.cellPhone.value?.trim(),
      },
    } as CreateApplication;
  }

  private submit(): void {
    this.submitting.set(true);
    this.collectFiles();
    this.applicationService
      .createApplicationCounrter(this.mapFormToApplication(), this.files())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe(() => {
        this.created.set(true);
      });
  }

  public reset() {
    this.currentStep.set(0);
    this.created.set(false);
    this.form.reset();
    this.form.patchValue({
      step_1: {
        typeDocument: '',
      },
      step_2: {
        typePerson: '',
      },
    });
  }
}

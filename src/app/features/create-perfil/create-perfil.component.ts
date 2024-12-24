import { ChangeDetectionStrategy, Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { onlyLettersValidator, emailValidator, rucValidator, cedulaValidator } from '@/utils/validators';
import { IdentificationType, Profile } from '@/interfaces';
import { ConfigFacturacionService } from '@/utils/services';
import { PerfilesService } from '../../services';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-create-perfil',
  imports: [CustomInputComponent, CustomSelectComponent, ReactiveFormsModule],
  templateUrl: './create-perfil.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePerfilComponent {
  public readonly typeDocument = signal<IdentificationType[]>([]);

  public readonly profileNames = signal<Profile[]>([]);

  public readonly loading = signal(false);

  @Output() createPerfil = new EventEmitter<any | null>();

  public readonly identificationLabel = signal<string>('Identificación');

  public readonly transformedTypeDocument = computed<{ values: string[]; labels: string[] }>(() =>
    this.typeDocument().reduce(
      (acc, item) => {
        acc.values.push(item.code);
        acc.labels.push(item.description);
        return acc;
      },
      { values: [], labels: [] } as { values: string[]; labels: string[] },
    ),
  );

  public readonly transformedProfileNames = computed<{ values: string[]; labels: string[] }>(() =>
    this.profileNames().reduce(
      (acc, item) => {
        acc.values.push(item.name);
        acc.labels.push(item.name);
        return acc;
      },
      { values: [], labels: [] } as { values: string[]; labels: string[] },
    ),
  );

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly _fb: FormBuilder,
    private readonly perfilService: PerfilesService,
  ) {
    this.getIdentificationTypes();
    this.getProfileNames();

    this.form.controls.typeDocument.valueChanges.subscribe((value: any) => {
      this.identificationNumberValidators(value);
    });
  }

  public readonly form = this._fb.group({
    names: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()]],
    typeDocument: ['', [Validators.required]],
    identificationNumber: ['', [Validators.required]],
    email: ['', [Validators.required, emailValidator()]],
    cellPhone: ['09', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    profileName: ['', [Validators.required]],
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

  private identificationNumberValidators(typeCode: string): void {
    const selectedType = this.typeDocument().find((type) => type.code === typeCode);

    if (selectedType) {
      const length = selectedType.length;
      this.identificationLabel.set(selectedType.description);
      const identificationControl = this.form.controls.identificationNumber;

      switch (typeCode) {
        case '04':
          identificationControl?.setValidators([
            Validators.required,
            rucValidator(),
            Validators.minLength(length),
            Validators.maxLength(length),
          ]);
          break;
        case '05':
          identificationControl?.setValidators([
            Validators.required,
            cedulaValidator(),
            Validators.minLength(length),
            Validators.maxLength(length),
          ]);
          break;
        default:
          identificationControl?.setValidators([
            Validators.required,
            Validators.minLength(length),
            Validators.maxLength(length),
          ]);
          break;
      }

      identificationControl?.updateValueAndValidity();
    }
  }

  private getIdentificationTypes() {
    this.perfilService.getIdentificationUser().subscribe((res) => this.typeDocument.set(res.data));
  }

  private getProfileNames() {
    this.perfilService.getListProfile().subscribe((res) => this.profileNames.set(res.data));
  }

  public submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const createPerfil = {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      typeDocument: this.form.value.typeDocument,
      identificationNumber: this.form.value.identificationNumber,
      email: this.form.value.email,
      cellPhone: this.form.value.cellPhone,
      profileName: this.form.value.profileName,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.perfilService.createPerfil(createPerfil)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          const respData: any = {
            idePersonaRol: resp.data,
            statusRecord: 'Activo',
            ...createPerfil,
          };
          this.createPerfil.emit(respData);
          this.form.reset();
          this.form.patchValue({
            cellPhone: '09',
            names: '',
            lastName: '',
            email: '',
            profileName: '',
            typeDocument: '',
            identificationNumber: '',
          });
        }
      });
  }
}

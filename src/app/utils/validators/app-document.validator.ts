import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { DraftDocument } from '@/interfaces';

export function appDocumentValidator(): ValidatorFn {
  return (
    control: AbstractControl<
      FormGroup<{
        certificatePassword: FormControl<string | null>;
        file: FormControl<File | null>;
      }>
    >,
  ): { [key: string]: any } | null => {
    const value = control.value as Partial<DraftDocument>;
    return !value?.file ? { required: true } : null;
  };
}

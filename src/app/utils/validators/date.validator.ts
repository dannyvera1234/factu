import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentDate = new Date();
    const inputDate = new Date(control.value);

    return inputDate > currentDate ? { INVALID_DATE: { value: control.value } } : null;
  };
}

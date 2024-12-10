import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function onlyLettersValidator(): ValidatorFn {
  const regex = new RegExp(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/);
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    return value && regex.test(value) ? null : { ONLY_LETTERS: true };
  };
}

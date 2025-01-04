import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador para el RUC
export function rucValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ruc = control.value?.toString().trim();

    if (!ruc) {
      return null; // Si no tiene valor, no se valida.
    }

    return validateRuc(ruc);
  };
}

// Función para validar el RUC
function validateRuc(ruc: string): ValidationErrors | null {
  const provinceCode = parseInt(ruc.substring(0, 2));

  if (provinceCode < 1 || provinceCode > 24) {
    return { INVALID_PROVINCE_CODE: true };
  }

  return null;
}

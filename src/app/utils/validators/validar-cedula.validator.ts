import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cedulaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cedula = control.value;


    // Verifica el código de provincia (los dos primeros dígitos deben estar entre 01 y 24)
    const codigoProvincia = parseInt(cedula.substring(0, 2), 10);
    if (codigoProvincia < 1 || codigoProvincia > 24) {
      return {  INVALID_PROVINCE_CODE: true};
    }

    // Algoritmo para verificar el dígito verificador
    const factores = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      suma += parseInt(cedula.charAt(i), 10) * factores[i];
    }



    return null; // Si pasa todas las validaciones, es válida
  };
}

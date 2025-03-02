import { AbstractControl, ValidationErrors } from '@angular/forms';

export function montoTotalValidator(total: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const pagos = control.value;
    if (!pagos || pagos.length === 0) {
      return null; // Si no hay pagos, no se valida
    }

    // Sumar los montos de cada pago
    const sumaMontos = pagos.reduce((sum: number, pago: any) => sum + (parseFloat(pago.paidAmount) || 0), 0);

    if (sumaMontos > total) {
      return { montoInvalido: true }; // Error si la suma no es igual al total
    }

    return null;
  };
}

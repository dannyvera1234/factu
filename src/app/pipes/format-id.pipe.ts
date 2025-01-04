import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatId',
  standalone: true,
})
export class FormatIdPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return ''; // Si no hay valor, retorna vacío

    const cleaned = value.toString().replace(/\D+/g, ''); // Remover caracteres no numéricos

    if (cleaned.length === 10) {
      // Formato de cédula: XXX-XXXXXX-X
      return cleaned.replace(/(\d{3})(\d{4})(\d{3})/, '$1-$2-$3');
    }

    if (cleaned.length === 13) {
      // Formato de RUC: XXX-XXXXXX-XXX
      return cleaned.replace(/(\d{10})(\d{3})/, '$1-$2');
    }

    // Si no cumple con las condiciones, retorna el valor original
    return value.toString();
  }
}

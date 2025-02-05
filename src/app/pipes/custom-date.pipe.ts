import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const dateFormat: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };

    // Manejo de fechas en formato ISO o `YYYY-MM-DD`
    if (typeof value === 'string') {
      const isSimpleDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
      const isISODate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);

      if (isSimpleDate) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('es-EC', dateFormat);
      }

      if (isISODate) {
        return new Date(value).toLocaleDateString('es-EC', dateFormat);
      }
    }

    // Si es Date, formatea directamente
    return new Date(value).toLocaleDateString('es-EC', dateFormat);
  }

}

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

    const dateTimeFormat: Intl.DateTimeFormatOptions = {
      ...dateFormat,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const isStringDate = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (isStringDate) {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day + 1));
      return date.toLocaleDateString('en-US', dateFormat);
    }

    const isISODate = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
    const date = new Date(value);

    const options = isISODate ? dateTimeFormat : dateFormat;

    return date.toLocaleDateString('en-US', options);
  }
}

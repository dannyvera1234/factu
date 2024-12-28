import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPhone',
  standalone: true,
})
export class FormatPhonePipe implements PipeTransform {
  transform(value: string, format: 'local' | 'international' = 'local'): string {
    if (!value) {
      return '';
    }

    const cleaned = value.replace(/\D+/g, ''); // Remover caracteres no numéricos
    if (format === 'international') {
      // Formato internacional +X (XXX) XXX-XXXX
      return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }

    // Formato local (XXX) XXX-XXXX
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, '($1) $2-$3-$4');
  }
}

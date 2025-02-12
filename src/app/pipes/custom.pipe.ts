import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom',
  standalone: true
})
export class CustomPipe implements PipeTransform {
  private months: string[] = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  transform(value: string): string {
    if (!value) return '';

    // Tomar solo la parte de la fecha antes del espacio o coma
    const datePart = value.split(/[ ,]/)[0];

    const parts = datePart.split('/');
    if (parts.length !== 3) return value; // Si el formato no es correcto, devolver el valor original

    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1; // Convertir el mes a índice (0-11)
    const year = `20${parts[2]}`; // Asumimos que el año está en formato corto (25 → 2025)

    return `${day} ${this.months[monthIndex]} de ${year}`;
  }

}

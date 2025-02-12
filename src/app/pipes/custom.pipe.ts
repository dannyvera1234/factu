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

    // Verificar que el formato sea YYYY-MM-DD
    const parts = value.split('-');
    if (parts.length !== 3) return value; // Si el formato no es correcto, devolver el valor original

    const year = parts[0]; // Año completo (2025)
    const monthIndex = parseInt(parts[1], 10) - 1; // Convertir el mes a índice (0-11)
    const day = parseInt(parts[2], 10); // Día sin ceros iniciales

    return `${day} ${this.months[monthIndex]} de ${year}`;
  }

}

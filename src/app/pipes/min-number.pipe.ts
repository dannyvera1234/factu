import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'min',
  standalone: true,
})
export class MinNumberPipe implements PipeTransform {
  transform(numbers: number[]): number {
    return Math.min(...numbers);
  }
}

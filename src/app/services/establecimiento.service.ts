import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { CreateEstablecimiento } from '@/interfaces/establecimiento';

@Injectable({
  providedIn: 'root',
})
export class EstablecimientoService {
  constructor() {}


  createEstablecimiento(createEstablecimiento: Partial<CreateEstablecimiento>): Observable<void> {
    return of({}).pipe(
      delay(1000),
      map(() => {
        console.log('createEstablecimiento', createEstablecimiento);
      }),
    );
  }

}

import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

constructor() { }

 public readonly info = signal<any | null>(null);





}

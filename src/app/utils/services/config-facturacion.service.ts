import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigFacturacionService {

  public readonly maxEmails = 2;

  public readonly maxPhones = 2;

constructor() { }



}

import { Injectable } from '@angular/core';
import { CommonPayload } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PayloadService {
  private origin = 'web';
  private usrRequest = 'danny';
  private ipRequest = '127.01.01.01';

constructor() { }


createPayload(module: string, payload: any = {}  ): CommonPayload {
  return {
    origin: this.origin,
    usrRequest: this.usrRequest,
    ipRequest: this.ipRequest,
    module: module,
    payload: payload,
  };
}
}

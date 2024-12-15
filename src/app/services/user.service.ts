import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}


  getAuthToker() {
    return localStorage.getItem('Bearer') || '';
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token') || '';
  }

}

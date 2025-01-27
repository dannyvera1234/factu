import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(UserService);

  // Verificar si el token existe
  const token = authService.getAuthToken();

  // Si no hay token o el token es inválido (por ejemplo, expirado)
  if (!token || !isTokenValid(token)) {
    // Eliminar el token del localStorage
    localStorage.removeItem('UserData');

    // Redirigir al login
    router.navigate(['/login']);

    return false;
  }
  return true;
};

// Función para verificar si el token es válido (puedes añadir lógica de validación adicional si usas JWT)
function isTokenValid(token: string): boolean {
  // Si estás usando JWT, puedes agregar una lógica para verificar su validez (por ejemplo, comprobar la expiración)
  const payload = decodeJwt(token);
  if (payload && payload.exp) {
    const expirationDate = new Date(payload.exp * 1000); // Convertir la expiración a milisegundos
    return expirationDate > new Date(); // Verificar si el token ha expirado
  }
  return false;
}

// Función para decodificar un JWT
function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload); // Decodificar la parte del payload
    return JSON.parse(decoded); // Parsear el JSON
  } catch (error) {
    return null;
  }
}

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from './notification.service';


@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(
    private readonly http: HttpClient,
    private readonly notification: NotificationService,
  ) {}

  public get<T>(url: string, errorHandled = false): Observable<T> {
    return this.http
      .get<T>(url)
      .pipe(catchError((error) => this.handleError<T>(error, errorHandled)));
  }

  public delete<T>(url: string, errorHandled = false): Observable<T> {
    return this.http
      .delete<T>(url)
      .pipe(catchError((error) => this.handleError<T>(error, errorHandled)));
  }

  public post<T>(url: string, options?: { body?: unknown }, errorHandled?: boolean): Observable<T> {
    return this.http
      .post<T>(url, options?.body ?? null, { responseType: 'json' })
      .pipe(catchError((error) => this.handleError<T>(error, errorHandled ?? false)));
  }

  public patch<T>(url: string, options?: { body?: unknown }, errorHandled?: boolean): Observable<T> {
    return this.http
      .patch<T>(url, options?.body ?? null, { responseType: 'json' })
      .pipe(catchError((error) => this.handleError<T>(error, errorHandled ?? false)));
  }

  public put<T>(url: string, options?: { body?: unknown }, errorHandled?: boolean): Observable<T> {
    return this.http
      .put<T>(url, options?.body ?? null)
      .pipe(catchError((error) => this.handleError<T>(error, errorHandled ?? false)));
  }

  public handleError<T>(error: HttpErrorResponse & any, errorHandled: boolean): Observable<T> {
    if (errorHandled) {
      return throwError(() => error);
    }

    const { message, code = 'NO_CODE', status, request_id = 'No request id found' } = error?.error ?? {};
    console.error(`[${status || error.status}] Request ID: ${request_id}`, error);
    console.error(`(${code}) ${message || error.message || 'No message'}`);

    const defaultMessage = 'Algo salió mal al conectarse con el servidor. Intenta nuevamente más tarde.';
    this.notification.push({ type: 'error', message: message || defaultMessage });

    return throwError(() => error);
  }
}

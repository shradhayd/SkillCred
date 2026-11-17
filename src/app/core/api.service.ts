import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

type Params = Record<string, string | number | boolean | undefined | null>;

/**
 * Thin wrapper around HttpClient for our Express backend.
 * The auth token is added automatically by authInterceptor.
 * Usage:  this.api.get<Booking[]>('/bookings')
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  get<T>(path: string, params?: Params): Observable<T> {
    return this.http.get<T>(this.base + path, { params: this.toParams(params) });
  }

  post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(this.base + path, body);
  }

  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(this.base + path, body);
  }

  put<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.put<T>(this.base + path, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.base + path);
  }

  private toParams(params?: Params): HttpParams {
    let result = new HttpParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== undefined && value !== null && value !== '') {
        result = result.set(key, String(value));
      }
    }
    return result;
  }
}
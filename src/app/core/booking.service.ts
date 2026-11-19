import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Session, Transaction } from '../shared/models';
import { ApiService } from './api.service';

export interface NewBooking {
  teacherId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  message: string;
}

/** Turns any backend/network error into a short message that can be shown to the user. */
export function apiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'Cannot reach the server. Is the backend running?';
    return err.error?.error || fallback;
  }
  return fallback;
}

/** Bookings (sessions), reviews and wallet history, all from the Express backend. */
@Injectable({ providedIn: 'root' })
export class BookingService {
  private api = inject(ApiService);

  create(booking: NewBooking): Observable<Session> {
    return this.api.post<Session>('/bookings', booking);
  }

  list(): Observable<Session[]> {
    return this.api.get<Session[]>('/bookings');
  }

  cancel(id: string): Observable<Session> {
    return this.api.post<Session>(`/bookings/${id}/cancel`);
  }

  complete(id: string): Observable<Session> {
    return this.api.post<Session>(`/bookings/${id}/complete`);
  }

  review(id: string, rating: number, comment: string): Observable<Session> {
    return this.api.post<Session>(`/bookings/${id}/review`, { rating, comment });
  }

  bookedSlots(teacherId: string, date: string): Observable<{ date: string; bookedSlots: string[] }> {
    return this.api.get(`/bookings/slots/${teacherId}`, { date });
  }

  transactions(): Observable<Transaction[]> {
    return this.api.get<Transaction[]>('/transactions');
  }
}
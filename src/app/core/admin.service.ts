import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminRow = Record<string, any>;

export interface AdminList {
  items: AdminRow[];
  nextCursor: string | null;
}

export interface AdminStats {
  users: number;
  teachers: number;
  bookings: number;
  upcomingBookings: number;
  completedBookings: number;
  openReports: number;
  openTickets: number;
  creditsInCirculation: number;
  categories: { name: string; teachers: number }[];
  monthly: { month: string; users: number; bookings: number }[];
}

/** Admin panel API (/api/admin/...). Only works for users who have the admin claim. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiService);

  stats(): Observable<AdminStats> {
    return this.api.get<AdminStats>('/admin/stats');
  }

  list(collection: string, options: { limit?: number; orderBy?: string; dir?: 'asc' | 'desc'; startAfter?: string } = {}): Observable<AdminList> {
    return this.api.get<AdminList>(`/admin/${collection}`, { limit: 25, ...options });
  }

  create(collection: string, data: AdminRow): Observable<AdminRow> {
    return this.api.post<AdminRow>(`/admin/${collection}`, data);
  }

  update(collection: string, id: string, data: AdminRow): Observable<AdminRow> {
    return this.api.patch<AdminRow>(`/admin/${collection}/${id}`, data);
  }

  remove(collection: string, id: string): Observable<unknown> {
    return this.api.delete(`/admin/${collection}/${id}`);
  }

  setAdmin(id: string, isAdmin: boolean): Observable<unknown> {
    return this.api.post(`/admin/users/${id}/admin`, { isAdmin });
  }

  suspend(id: string, suspended: boolean): Observable<unknown> {
    return this.api.post(`/admin/users/${id}/suspend`, { suspended });
  }
}
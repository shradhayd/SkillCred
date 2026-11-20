import { Injectable, computed, inject, signal } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { Timestamp, Unsubscribe, collection, onSnapshot, query, where } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { auth, db } from './firebase';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  time: string; // "5 min ago"
  at: number;
}

function timeAgo(date: Date | null): string {
  if (!date) return 'just now';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

/**
 * My notifications, live. The backend creates them (new booking, cancellation, credits, review),
 * Firestore pushes them here, and "mark as read" goes through the backend.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);
  private stop?: Unsubscribe;

  readonly items = signal<AppNotification[]>([]);
  readonly unread = computed(() => this.items().filter((n) => !n.read).length);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.stop?.();
      this.stop = undefined;
      this.items.set([]);
      if (!user) return;

      const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
      this.stop = onSnapshot(
        q,
        (snap) => {
          const list = snap.docs.map((d): AppNotification => {
            const data = d.data();
            const created = data['createdAt'] instanceof Timestamp ? data['createdAt'].toDate() : null;
            return {
              id: d.id,
              title: data['title'] || '',
              message: data['message'] || '',
              link: data['link'] || '',
              read: data['read'] === true,
              time: timeAgo(created),
              at: created?.getTime() ?? Date.now(),
            };
          });
          // Newest first, keep the latest 30.
          this.items.set(list.sort((a, b) => b.at - a.at).slice(0, 30));
        },
        () => this.items.set([]) // e.g. rules not published yet: just show nothing
      );
    });
  }

  async markRead(id: string): Promise<void> {
    this.items.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await firstValueFrom(this.api.post(`/notifications/${id}/read`)).catch(() => undefined);
  }

  async markAllRead(): Promise<void> {
    this.items.update((list) => list.map((n) => ({ ...n, read: true })));
    await firstValueFrom(this.api.post('/notifications/read-all')).catch(() => undefined);
  }
}
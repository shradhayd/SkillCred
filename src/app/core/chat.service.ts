import { Injectable, inject } from '@angular/core';
import {
  Timestamp,
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { auth, db } from './firebase';

export interface ChatThread {
  id: string;
  otherId: string;
  name: string;
  photo: string;
  lastMessage: string;
  lastMessageAt: Date | null;
  unread: number;
}

export interface ChatLine {
  id: string;
  text: string;
  createdAt: Date | null;
  isMine: boolean;
}

const toDate = (v: unknown): Date | null => (v instanceof Timestamp ? v.toDate() : null);

/**
 * Chat. READING is live: Firestore listeners push every change to the screen instantly.
 * WRITING (open chat, send, mark read) goes through the Express backend.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);

  /** Live list of my conversations, newest first. */
  threads(): Observable<ChatThread[]> {
    return new Observable<ChatThread[]>((subscriber) => {
      const me = auth.currentUser?.uid;
      if (!me) {
        subscriber.next([]);
        return;
      }
      const q = query(collection(db, 'conversations'), where('participants', 'array-contains', me));
      return onSnapshot(
        q,
        (snap) => {
          const list = snap.docs.map((d): ChatThread => {
            const data = d.data();
            const otherId = (data['participants'] as string[]).find((p) => p !== me) ?? '';
            return {
              id: d.id,
              otherId,
              name: data['names']?.[otherId] || 'User',
              photo: data['photos']?.[otherId] || '',
              lastMessage: data['lastMessage'] || '',
              lastMessageAt: toDate(data['lastMessageAt']),
              unread: data['unread']?.[me] ?? 0,
            };
          });
          list.sort((a, b) => (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0));
          subscriber.next(list);
        },
        (err) => subscriber.error(err)
      );
    });
  }

  /** Live messages of one conversation (last 200), oldest first. */
  messages(conversationId: string): Observable<ChatLine[]> {
    return new Observable<ChatLine[]>((subscriber) => {
      const me = auth.currentUser?.uid;
      const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('createdAt', 'asc'),
        limitToLast(200)
      );
      return onSnapshot(
        q,
        (snap) =>
          subscriber.next(
            snap.docs.map((d) => ({
              id: d.id,
              text: d.data()['text'] as string,
              createdAt: toDate(d.data()['createdAt']),
              isMine: d.data()['senderId'] === me,
            }))
          ),
        (err) => subscriber.error(err)
      );
    });
  }

  /** Opens (or finds) the chat with someone and returns its id. */
  async open(userId: string): Promise<string> {
    const res = await firstValueFrom(this.api.post<{ id: string }>('/chat/conversations', { userId }));
    return res.id;
  }

  send(conversationId: string, text: string): Promise<unknown> {
    return firstValueFrom(this.api.post(`/chat/conversations/${conversationId}/messages`, { text }));
  }

  markRead(conversationId: string): Promise<unknown> {
    return firstValueFrom(this.api.post(`/chat/conversations/${conversationId}/read`));
  }
}
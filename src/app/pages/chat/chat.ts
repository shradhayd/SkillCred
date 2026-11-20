import { DatePipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { ChatLine, ChatService, ChatThread } from '../../core/chat.service';
import { apiErrorMessage } from '../../core/booking.service';

@Component({
  selector: 'app-chat',
  imports: [DatePipe, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, Navbar, Footer],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  protected auth = inject(AuthService);
  private chat = inject(ChatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected threads = signal<ChatThread[]>([]);
  protected messages = signal<ChatLine[]>([]);
  protected activeId = signal<string | null>(null);
  protected loading = signal(true);
  protected error = signal('');
  protected newMessage = '';
  protected sending = false;

  protected showCodeEditor = false;
  protected codeLanguage = 'javascript';
  protected codeContent = '// Write your code here\nconsole.log("Hello SkillCred!");';

  private messagesBox = viewChild<ElementRef<HTMLElement>>('messagesBox');
  private messageSub?: Subscription;

  protected get activeThread(): ChatThread | undefined {
    return this.threads().find((t) => t.id === this.activeId());
  }

  constructor() {
    // Live list of conversations.
    this.chat
      .threads()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (threads) => {
          this.threads.set(threads);
          this.loading.set(false);
          // Nothing selected yet and no ?with= link: open the newest chat.
          if (!this.activeId() && !this.route.snapshot.queryParamMap.get('with') && threads.length) {
            this.select(threads[0].id);
          }
          // A message arrived while this chat is open: clear its unread badge.
          const active = threads.find((t) => t.id === this.activeId());
          if (active && active.unread > 0) this.chat.markRead(active.id).catch(() => undefined);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Could not load your chats. Check that Firestore rules are published.');
        },
      });

    // Opened from a "Message" button or a bell notification: /chat?with=<userId>.
    // Subscribed (not a snapshot) so it also works when you are already on the chat page.
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const withId = params.get('with');
      if (!withId) return;
      this.chat
        .open(withId)
        .then((id) => {
          this.select(id);
          this.router.navigate([], { queryParams: {}, replaceUrl: true });
        })
        .catch((err) => this.error.set(apiErrorMessage(err)));
    });

    // Always scroll to the newest message.
    effect(() => {
      this.messages();
      const box = this.messagesBox()?.nativeElement;
      if (box) setTimeout(() => (box.scrollTop = box.scrollHeight));
    });

    this.destroyRef.onDestroy(() => this.messageSub?.unsubscribe());
  }

  select(id: string): void {
    if (this.activeId() === id) return;
    this.activeId.set(id);
    this.messages.set([]);
    this.messageSub?.unsubscribe();
    this.messageSub = this.chat.messages(id).subscribe({
      next: (lines) => this.messages.set(lines),
      error: () => this.error.set('Could not load messages.'),
    });
    this.chat.markRead(id).catch(() => undefined);
  }

  async sendMessage(): Promise<void> {
    const id = this.activeId();
    const text = this.newMessage.trim();
    if (!id || !text || this.sending) return;

    this.sending = true;
    this.error.set('');
    try {
      await this.chat.send(id, text);
      this.newMessage = ''; // the message itself appears through the live listener
    } catch (err) {
      this.error.set(apiErrorMessage(err));
    }
    this.sending = false;
  }

  toggleCodeEditor(): void {
    this.showCodeEditor = !this.showCodeEditor;
  }

  runCode(): void {
    // Mock output - no real execution
  }
}
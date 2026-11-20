import { Component, DestroyRef, Input, effect, inject, signal } from '@angular/core';import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ChatService } from '../../core/chat.service';
import { ThemeService } from '../../core/theme.service';
import { NotificationService } from '../../core/notification.service';
@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink, RouterLinkActive,
    MatButton, MatIconButton, MatIconModule, MatMenuModule, MatBadgeModule, MatDividerModule, MatTooltipModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() isLoggedIn = false;
  @Input() isAdmin    = false;

  protected auth = inject(AuthService);
  protected theme = inject(ThemeService);
  private   router = inject(Router);
    private   chat = inject(ChatService);

  /** Total unread chat messages, updated live. */
  protected unreadMessages = signal(0);
  private chatSub?: Subscription;

  constructor() {
    effect(() => {
      this.chatSub?.unsubscribe();
      this.unreadMessages.set(0);
      if (!this.auth.isLoggedIn()) return;
      this.chatSub = this.chat.threads().subscribe({
        next: (threads) => this.unreadMessages.set(threads.reduce((sum, t) => sum + t.unread, 0)),
        error: () => undefined,
      });
    });
    inject(DestroyRef).onDestroy(() => this.chatSub?.unsubscribe());
  }

  private   notifService = inject(NotificationService);
  protected notifications = this.notifService.items;
  protected unreadCount   = this.notifService.unread;

  openNotification(n: { id: string; link: string; read: boolean }): void {
    if (!n.read) this.notifService.markRead(n.id);
    if (n.link) this.router.navigateByUrl(n.link);
  }

  markAllNotificationsRead(): void {
    this.notifService.markAllRead();
  }
  menuOpen = false;   // mobile drawer
  moreOpen = false;   // desktop "More" dropdown

  /** Highlight the "More" button when any sub-page is active */
  isMoreActive(): boolean {
    const url = this.router.url;
    return ['/about-us', '/contact-us', '/privacy-policy', '/terms-of-service']
      .some(p => url.startsWith(p));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}

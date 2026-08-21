import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/auth.service';
import { NOTIFICATIONS } from '../mock-data';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink, RouterLinkActive,
    MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, MatDividerModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() isLoggedIn = false;
  @Input() isAdmin    = false;

  protected auth = inject(AuthService);
  private   router = inject(Router);

  protected notifications = NOTIFICATIONS;
  protected unreadCount   = NOTIFICATIONS.filter(n => !n.read).length;

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

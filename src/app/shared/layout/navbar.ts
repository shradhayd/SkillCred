import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../core/auth.service';
import { NOTIFICATIONS } from '../mock-data';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() isLoggedIn = false;
  @Input() isAdmin = false;

  protected auth = inject(AuthService);
  private router = inject(Router);
  protected notifications = NOTIFICATIONS;
  protected unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}

import { Injectable, computed, signal } from '@angular/core';
import { CURRENT_USER } from '../shared/mock-data';
import { User } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = signal(false);
  private user = signal<User | null>(null);

  readonly isLoggedIn = computed(() => this.loggedIn());
  readonly currentUser = computed(() => this.user());
  readonly isAdmin = computed(() => this.user()?.isAdmin ?? false);

  login(email: string, password: string): boolean {
    if (email === 'shradha@gmail.com' && password === 'shradha1234') {
      this.loggedIn.set(true);
      this.user.set(CURRENT_USER);
      return true;
    }
    return false;
  }

  signup(name: string, email: string, password: string): boolean {
    if (name && email && password.length >= 6) {
      this.loggedIn.set(true);
      this.user.set({ ...CURRENT_USER, name, email, isAdmin: false });
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn.set(false);
    this.user.set(null);
  }
}

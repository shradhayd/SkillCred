import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../shared/models';
import { auth } from './firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private user = signal<User | null>(null);

  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly currentUser = computed(() => this.user());
  readonly isAdmin = computed(() => this.user()?.isAdmin ?? false);

  /**
   * Resolves once Firebase has told us whether someone is logged in (and, if so,
   * their profile is loaded). app.config.ts waits for this before the app starts,
   * so a page refresh does not bounce a logged-in user to /login.
   */
  readonly ready: Promise<void>;
  private markReady!: () => void;

  // While login()/signup() run, they load the profile themselves,
  // so the auth-state listener must not do it a second time.
  private manualFlow = false;

  constructor() {
    this.ready = new Promise<void>((resolve) => (this.markReady = resolve));

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (this.manualFlow) return;
      try {
        if (firebaseUser) {
          await this.loadProfile();
        } else {
          this.user.set(null);
        }
      } catch {
        // Backend unreachable: treat as logged out for now (Firebase session stays).
        this.user.set(null);
      } finally {
        this.markReady();
      }
    });
  }

  /** Logs in with Firebase, then loads the profile from our backend. Throws Error(friendly message). */
  async login(email: string, password: string): Promise<void> {
    this.manualFlow = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await this.loadProfile();
    } catch (err) {
      await signOut(auth).catch(() => undefined);
      this.user.set(null);
      throw new Error(this.friendlyError(err));
    } finally {
      this.manualFlow = false;
    }
  }

  /**
   * Creates the Firebase account, sets the display name, then asks the backend for the
   * profile. The backend creates users/{uid} with the signup credits on that first call.
   */
  async signup(name: string, email: string, password: string): Promise<void> {
    this.manualFlow = true;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name.trim() });
      await this.loadProfile();
    } catch (err) {
      // If the account was created but the profile step failed, don't leave a half-logged-in state.
      await signOut(auth).catch(() => undefined);
      this.user.set(null);
      throw new Error(this.friendlyError(err));
    } finally {
      this.manualFlow = false;
    }
  }

  /**
   * Google sign-in. Works for both "login" and "signup": if it is the user's first time,
   * the backend creates the profile (with signup credits) on the /me call.
   */
  async loginWithGoogle(): Promise<void> {
    this.manualFlow = true;
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      await this.loadProfile();
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return; // the user just closed the popup, that is not an error
      }
      await signOut(auth).catch(() => undefined);
      this.user.set(null);
      throw new Error(this.friendlyError(err));
    } finally {
      this.manualFlow = false;
    }
  }

  async logout(): Promise<void> {
    this.user.set(null); // UI updates immediately
    await signOut(auth);
  }

  /**
   * Re-reads the profile from the backend (e.g. after credits change).
   * Pass forceTokenRefresh = true after someone was made admin, to pick up the new claim.
   */
  async refreshProfile(forceTokenRefresh = false): Promise<void> {
    if (!auth.currentUser) return;
    if (forceTokenRefresh) await auth.currentUser.getIdToken(true);
    await this.loadProfile();
  }
    /** Saves profile changes (PATCH /api/me) and updates the logged-in user. */
  async saveProfile(changes: Record<string, unknown>): Promise<void> {
    try {
      const updated = await firstValueFrom(this.http.patch<User>(`${environment.apiUrl}/me`, changes));
      this.user.set(updated);
    } catch (err) {
      throw new Error(this.friendlyError(err));
    }
  }

  private async loadProfile(): Promise<void> {
    const profile = await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/me`));
    this.user.set(profile);
  }

  private friendlyError(err: unknown): string {
    console.error('Auth error:', err);

    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return `Cannot reach the server. Is the backend running at ${environment.apiUrl}?`;
      }
      return err.error?.error || 'The server returned an error. Please try again.';
    }

    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in instead.';
      case 'auth/account-exists-with-different-credential':
        return 'An account with this email already exists using a different sign-in method.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/popup-blocked':
        return 'The sign-in popup was blocked by your browser. Allow popups and try again.';
      case 'auth/unauthorized-domain':
        return 'This website address is not allowed in Firebase (Authentication, Settings, Authorized domains).';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled in Firebase yet.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
}
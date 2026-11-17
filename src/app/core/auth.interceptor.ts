import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { auth } from './firebase';

/**
 * Adds "Authorization: Bearer <Firebase ID token>" to every request that goes to our own backend.
 * getIdToken() refreshes the token automatically when it is about to expire.
 *
 * Note: it imports `auth` directly (not AuthService) to avoid a circular dependency,
 * because AuthService itself uses HttpClient.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    return next(req);
  }

  return from(firebaseUser.getIdToken()).pipe(
    switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
  );
};
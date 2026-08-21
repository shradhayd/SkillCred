import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./pages/how-it-works/how-it-works').then(m => m.HowItWorks),
  },
  {
    path: 'browse-skills',
    loadComponent: () => import('./pages/browse-skills/browse-skills').then(m => m.BrowseSkills),
  },
  {
    path: 'my-profile',
    loadComponent: () => import('./pages/my-profile/my-profile').then(m => m.MyProfile),
    canActivate: [authGuard],
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/teacher-profile/teacher-profile').then(m => m.TeacherProfile),
  },
  {
    path: 'wallet',
    loadComponent: () => import('./pages/wallet/wallet').then(m => m.Wallet),
    canActivate: [authGuard],
  },
  {
    path: 'booking/:teacherId',
    loadComponent: () => import('./pages/booking/booking').then(m => m.Booking),
    canActivate: [authGuard],
  },
  {
    path: 'session-history',
    loadComponent: () => import('./pages/session-history/session-history').then(m => m.SessionHistory),
    canActivate: [authGuard],
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat').then(m => m.Chat),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [adminGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then(m => m.Settings),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then(m => m.Signup),
  },
  // ── New info pages ──────────────────────────────────
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./pages/terms-of-service/terms-of-service').then(m => m.TermsOfService),
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./pages/contact-us/contact-us').then(m => m.ContactUs),
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about-us/about-us').then(m => m.AboutUs),
  },
  // ── User dashboard panel ────────────────────────────
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/user-panel/user-panel').then(m => m.UserPanel),
    canActivate: [authGuard],
  },
];

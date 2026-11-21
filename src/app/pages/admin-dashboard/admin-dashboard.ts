import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Navbar } from '../../shared/layout/navbar';
import { AuthService } from '../../core/auth.service';
import { AdminRow, AdminService, AdminStats, EmailStatus } from '../../core/admin.service';
import { apiErrorMessage } from '../../core/booking.service';
import { AdminDocDialog } from './admin-doc-dialog';

type Kind = 'text' | 'strong' | 'muted' | 'pill' | 'role' | 'user';

interface Column {
  label: string;
  value: (r: AdminRow) => string | number;
  kind?: Kind;
}

interface Section {
  id: string;
  label: string;
  singular: string;
  icon: string;
  collection?: string; // missing = the overview page
  orderBy?: string;
  columns?: Column[];
  canCreate?: boolean;
  readOnly?: boolean;
  template?: AdminRow;
}

const date = (v: unknown) => String(v ?? '').slice(0, 10);
const short = (v: unknown, n = 60) => {
  const s = String(v ?? '');
  return s.length > n ? s.slice(0, n) + '…' : s;
};

const SECTIONS: Section[] = [
  { id: 'overview', label: 'Overview', singular: '', icon: 'dashboard' },
  {
    id: 'users', label: 'Users', singular: 'user', icon: 'people', collection: 'users',
    columns: [
      { label: 'User', kind: 'user', value: (r) => r['name'] || '(no name)' },
      { label: 'Email', kind: 'muted', value: (r) => r['email'] || '' },
      { label: 'Role', kind: 'role', value: (r) => (r['isAdmin'] ? 'admin' : r['isTeacher'] ? 'teacher' : 'student') },
      { label: 'Status', kind: 'pill', value: (r) => (r['suspended'] ? 'suspended' : 'active') },
      { label: 'Credits', kind: 'strong', value: (r) => r['credits'] ?? 0 },
      { label: 'Rating', kind: 'muted', value: (r) => (r['ratingCount'] ? `${r['rating']} (${r['ratingCount']})` : '—') },
      { label: 'Joined', kind: 'muted', value: (r) => date(r['createdAt']) || '—' },
    ],
  },
  {
    id: 'bookings', label: 'Sessions', singular: 'session', icon: 'event', collection: 'bookings',
    columns: [
      { label: 'Skill', kind: 'strong', value: (r) => r['skill'] },
      { label: 'Student', value: (r) => r['studentName'] },
      { label: 'Teacher', value: (r) => r['teacherName'] },
      { label: 'Date', kind: 'muted', value: (r) => r['date'] },
      { label: 'Time', kind: 'muted', value: (r) => r['timeSlot'] },
      { label: 'Credits', kind: 'strong', value: (r) => r['credits'] },
      { label: 'Status', kind: 'pill', value: (r) => r['status'] },
    ],
  },
  {
    id: 'transactions', label: 'Transactions', singular: 'transaction', icon: 'account_balance_wallet', collection: 'transactions',
    columns: [
      { label: 'Type', kind: 'strong', value: (r) => r['type'] },
      { label: 'Skill', value: (r) => r['skill'] || '—' },
      { label: 'User ID', kind: 'muted', value: (r) => short(r['userId'], 12) },
      { label: 'With', value: (r) => r['withWhom'] || '—' },
      { label: 'Credits', kind: 'strong', value: (r) => r['credits'] },
      { label: 'Status', kind: 'pill', value: (r) => r['status'] },
      { label: 'Created', kind: 'muted', value: (r) => date(r['createdAt']) },
    ],
  },
  {
    id: 'reviews', label: 'Reviews', singular: 'review', icon: 'star', collection: 'reviews',
    columns: [
      { label: 'Reviewer', value: (r) => r['reviewerName'] },
      { label: 'Teacher ID', kind: 'muted', value: (r) => short(r['teacherId'], 12) },
      { label: 'Rating', kind: 'strong', value: (r) => `${r['rating']} ⭐` },
      { label: 'Comment', kind: 'muted', value: (r) => short(r['comment']) || '—' },
      { label: 'Created', kind: 'muted', value: (r) => date(r['createdAt']) },
    ],
  },
  {
    id: 'reports', label: 'Reports', singular: 'report', icon: 'flag', collection: 'reports', canCreate: true,
    template: { reporterName: '', reportedUserName: '', reportedUserId: '', reason: '', status: 'open' },
    columns: [
      { label: 'Reporter', value: (r) => r['reporterName'] || r['reporter'] || '—' },
      { label: 'Reported user', value: (r) => r['reportedUserName'] || r['reportedUser'] || '—' },
      { label: 'Reason', kind: 'muted', value: (r) => short(r['reason']) },
      { label: 'Date', kind: 'muted', value: (r) => date(r['createdAt']) },
      { label: 'Status', kind: 'pill', value: (r) => r['status'] },
    ],
  },
  {
    id: 'categories', label: 'Categories', singular: 'category', icon: 'category', collection: 'categories', canCreate: true,
    template: { name: '', icon: '📚', colorClass: 'icon-box-teal', order: 10 },
    columns: [
      { label: 'Icon', value: (r) => r['icon'] },
      { label: 'Name', kind: 'strong', value: (r) => r['name'] },
      { label: 'Color class', kind: 'muted', value: (r) => r['colorClass'] },
      { label: 'Order', kind: 'muted', value: (r) => r['order'] ?? '—' },
    ],
  },
  {
    id: 'tickets', label: 'Support Tickets', singular: 'ticket', icon: 'support_agent', collection: 'tickets', canCreate: true,
    template: { name: '', email: '', subject: '', message: '', status: 'open' },
    columns: [
      { label: 'From', value: (r) => r['name'] },
      { label: 'Email', kind: 'muted', value: (r) => r['email'] },
      { label: 'Subject', kind: 'strong', value: (r) => short(r['subject'], 40) },
      { label: 'Message', kind: 'muted', value: (r) => short(r['message']) },
      { label: 'Date', kind: 'muted', value: (r) => date(r['createdAt']) },
      { label: 'Status', kind: 'pill', value: (r) => r['status'] },
    ],
  },
  {
    id: 'auditLogs', label: 'Audit Log', singular: 'log entry', icon: 'history', collection: 'auditLogs', readOnly: true,
    columns: [
      { label: 'When', kind: 'muted', value: (r) => String(r['createdAt'] ?? '').replace('T', ' ').slice(0, 16) },
      { label: 'Admin', value: (r) => r['adminEmail'] },
      { label: 'Action', kind: 'strong', value: (r) => r['action'] },
      { label: 'Collection', kind: 'muted', value: (r) => r['collection'] },
      { label: 'Document', kind: 'muted', value: (r) => short(r['docId'], 14) },
    ],
  },
];

const COLORS = ['teal', 'purple', 'blue', 'coral', 'pink'];

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe, FormsModule,MatSlideToggleModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, Navbar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  protected auth = inject(AuthService);
  private admin = inject(AdminService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  protected navItems = SECTIONS;
  protected today = new Date();
  protected activeId = signal('overview');
  protected sidebarCollapsed = signal(false);
  protected section = computed(() => SECTIONS.find((s) => s.id === this.activeId()) ?? SECTIONS[0]);

  protected rows = signal<AdminRow[]>([]);
  protected nextCursor = signal<string | null>(null);
  protected loading = signal(false);
  protected error = signal('');
  protected search = '';

  protected stats = signal<AdminStats | null>(null);
  protected recent = signal<AdminRow[]>([]);
    protected email = signal<EmailStatus | null>(null);
  protected emailBusy = signal(false);

  protected filteredRows = computed(() => {
    const q = this.search.trim().toLowerCase();
    const all = this.rows();
    return q ? all.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : all;
  });

  protected statCards = computed(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Total Users', value: s.users, sub: `${s.teachers} teachers`, icon: 'people', color: 'teal' },
      { label: 'Sessions', value: s.bookings, sub: `${s.upcomingBookings} upcoming · ${s.completedBookings} completed`, icon: 'event', color: 'purple' },
      { label: 'Credits in Circulation', value: s.creditsInCirculation, sub: 'held by users', icon: 'account_balance_wallet', color: 'blue' },
      { label: 'Open Reports', value: s.openReports, sub: `${s.openTickets} open tickets`, icon: 'flag', color: 'coral' },
    ];
  });

  protected maxUsers = computed(() => Math.max(1, ...(this.stats()?.monthly.map((m) => m.users) ?? [1])));
  protected maxBookings = computed(() => Math.max(1, ...(this.stats()?.monthly.map((m) => m.bookings) ?? [1])));
  protected maxTeachers = computed(() => Math.max(1, ...(this.stats()?.categories.map((c) => c.teachers) ?? [1])));
  protected color = (i: number) => COLORS[i % COLORS.length];

  constructor() {
    this.openSection('overview');
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  openSection(id: string): void {
    this.activeId.set(id);
    this.search = '';
    this.rows.set([]);
    this.nextCursor.set(null);
    this.error.set('');
    if (id === 'overview') this.loadOverview();
    else this.load(false);
  }

  refresh(): void {
    this.openSection(this.activeId());
  }

  private async loadOverview(): Promise<void> {
    this.loading.set(true);
    try {
            const [stats, recent, email] = await Promise.all([
        firstValueFrom(this.admin.stats()),
        firstValueFrom(this.admin.list('auditLogs', { limit: 8 })),
        firstValueFrom(this.admin.emailStatus()),
      ]);
      this.stats.set(stats);
      this.recent.set(recent.items);
      this.email.set(email);
    } catch (err) {
      this.error.set(apiErrorMessage(err, 'Could not load the overview.'));
    }
    this.loading.set(false);
  }

  async load(more: boolean): Promise<void> {
    const sec = this.section();
    if (!sec.collection) return;

    this.loading.set(true);
    this.error.set('');
    try {
      const res = await firstValueFrom(
        this.admin.list(sec.collection, { startAfter: more ? (this.nextCursor() ?? undefined) : undefined })
      );
      // Ignore a late answer if the admin already switched to another section.
      if (this.section().id !== sec.id) return;
      this.rows.update((old) => (more ? [...old, ...res.items] : res.items));
      this.nextCursor.set(res.nextCursor);
    } catch (err) {
      this.error.set(apiErrorMessage(err, 'Could not load data.'));
    }
    this.loading.set(false);
  }
  // ---------- email kill-switch ----------

  /** Turns the whole email service on or off. While OFF, the backend sends no emails at all. */
  async toggleEmails(enabled: boolean): Promise<void> {
    const current = this.email();
    if (!current || this.emailBusy()) return;

    this.emailBusy.set(true);
    try {
      await firstValueFrom(this.admin.setEmailsEnabled(enabled));
      this.email.set({ ...current, enabled });
      this.snackBar.open(enabled ? 'Emails are ON' : 'Emails are OFF. No email will be sent.', 'OK', { duration: 4000 });
    } catch (err) {
      this.snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
    }
    this.emailBusy.set(false);
  }
  // ---------- create / edit / delete ----------

  openEditor(row: AdminRow | null): void {
    const sec = this.section();
    if (!sec.collection) return;
    this.dialog
      .open(AdminDocDialog, {
        width: '560px',
        data: { collection: sec.collection, label: sec.singular, id: row?.['id'], doc: row ?? sec.template ?? {} },
      })
      .afterClosed()
      .subscribe((saved: AdminRow | undefined) => {
        if (!saved) return;
        this.rows.update((list) =>
          row ? list.map((r) => (r['id'] === saved['id'] ? saved : r)) : [saved, ...list]
        );
        this.snackBar.open('Saved', 'OK', { duration: 2500 });
      });
  }

  async remove(row: AdminRow): Promise<void> {
    const sec = this.section();
    if (!sec.collection) return;

    let warning = '';
    if (sec.collection === 'users') warning = '\n\nThis also deletes their login account.';
    if (sec.collection === 'bookings') warning = '\n\nCredits are NOT refunded automatically. Use Cancel from the app for that.';
    if (!confirm(`Delete this ${sec.singular}? This cannot be undone.${warning}`)) return;

    try {
      await firstValueFrom(this.admin.remove(sec.collection, row['id']));
      this.rows.update((list) => list.filter((r) => r['id'] !== row['id']));
      this.snackBar.open('Deleted', 'OK', { duration: 2500 });
    } catch (err) {
      this.snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
    }
  }

  // ---------- quick actions ----------

  /** Reports and tickets: move an open item to resolved / dismissed. */
  async setStatus(row: AdminRow, status: 'resolved' | 'dismissed'): Promise<void> {
    const sec = this.section();
    if (!sec.collection) return;
    try {
      const saved = await firstValueFrom(this.admin.update(sec.collection, row['id'], { status }));
      this.rows.update((list) => list.map((r) => (r['id'] === saved['id'] ? saved : r)));
    } catch (err) {
      this.snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
    }
  }

  async toggleSuspend(user: AdminRow): Promise<void> {
    const suspend = user['suspended'] !== true;
    if (suspend && !confirm(`Suspend ${user['name']}? They will be logged out and cannot log in.`)) return;
    try {
      await firstValueFrom(this.admin.suspend(user['id'], suspend));
      this.patchRow(user['id'], { suspended: suspend });
      this.snackBar.open(suspend ? 'User suspended' : 'User activated', 'OK', { duration: 2500 });
    } catch (err) {
      this.snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
    }
  }

  async toggleAdmin(user: AdminRow): Promise<void> {
    const makeAdmin = user['isAdmin'] !== true;
    const question = makeAdmin ? `Make ${user['name']} an admin?` : `Remove admin access from ${user['name']}?`;
    if (!confirm(question)) return;
    try {
      await firstValueFrom(this.admin.setAdmin(user['id'], makeAdmin));
      this.patchRow(user['id'], { isAdmin: makeAdmin });
      this.snackBar.open('Done. The user must log out and log in again for this to apply.', 'OK', { duration: 6000 });
    } catch (err) {
      this.snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
    }
  }

  private patchRow(id: string, changes: AdminRow): void {
    this.rows.update((list) => list.map((r) => (r['id'] === id ? { ...r, ...changes } : r)));
  }

  protected avatar(r: AdminRow): string {
    return r['photo'] || `https://ui-avatars.com/api/?background=1D9E75&color=fff&name=${encodeURIComponent(r['name'] || 'U')}`;
  }

  protected activityText(log: AdminRow): string {
    return `${log['adminEmail']} · ${log['action']} · ${log['collection']}`;
  }
}
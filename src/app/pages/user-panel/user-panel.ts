import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { BookingService } from '../../core/booking.service';
import { NotificationService } from '../../core/notification.service';
import { TeacherService } from '../../core/teacher.service';
import { Review, Session, Transaction } from '../../shared/models';

interface ChartMonth {
  month: string;
  earned: number;
  spent: number;
}

@Component({
  selector: 'app-user-panel',
  imports: [RouterLink, MatButtonModule, MatIconModule, Navbar, Footer],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css',
})
export class UserPanel implements OnInit {
  protected auth = inject(AuthService);
  private bookingService = inject(BookingService);
  private teacherService = inject(TeacherService);
  private notifService = inject(NotificationService);

  protected activeTab = signal<'overview' | 'sessions' | 'credits' | 'notifications'>('overview');

  private sessionList = signal<Session[]>([]);
  private transactionList = signal<Transaction[]>([]);
  private reviewList = signal<Review[]>([]);

  // Getters keep the template unchanged: it reads `sessions`, `transactions`, `reviews`, `chartData`.
  protected get sessions(): Session[] { return this.sessionList(); }
  protected get transactions(): Transaction[] { return this.transactionList(); }
  protected get reviews(): Review[] { return this.reviewList(); }
  protected get chartData(): ChartMonth[] { return this.chart(); }

  // Live notifications (shared with the navbar bell).
  protected notifications = this.notifService.items;
  protected unreadCount = this.notifService.unread;

  protected upcomingSessions  = computed(() => this.sessionList().filter(s => s.status === 'upcoming'));
  protected completedSessions = computed(() => this.sessionList().filter(s => s.status === 'completed'));
  protected cancelledSessions = computed(() => this.sessionList().filter(s => s.status === 'cancelled'));

  // Only completed transactions count; pending ones are credits held for upcoming sessions.
  protected totalEarned = computed(() =>
    this.transactionList().filter(t => t.type === 'earned' && t.status === 'completed').reduce((sum, t) => sum + t.credits, 0)
  );
  protected totalSpent = computed(() =>
    this.transactionList().filter(t => t.type === 'spent' && t.status === 'completed').reduce((sum, t) => sum + t.credits, 0)
  );
  private onHold = computed(() =>
    this.transactionList().filter(t => t.type === 'spent' && t.status === 'pending').reduce((sum, t) => sum + t.credits, 0)
  );

  /** Last 6 months of completed credit activity. */
  private chart = computed<ChartMonth[]>(() => {
    const now = new Date();
    const months: (ChartMonth & { key: string })[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: d.toLocaleString('en-US', { month: 'short' }), earned: 0, spent: 0 });
    }
    for (const t of this.transactionList()) {
      if (t.status !== 'completed' || !t.createdAt) continue;
      const d = new Date(t.createdAt);
      const bucket = months.find(m => m.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (!bucket) continue;
      if (t.type === 'earned') bucket.earned += t.credits;
      else bucket.spent += t.credits;
    }
    return months.map(({ month, earned, spent }) => ({ month, earned, spent }));
  });

  protected get maxChartValue(): number {
    return Math.max(1, ...this.chart().flatMap(d => [d.earned, d.spent]));
  }

  protected quickActions = [
    { icon: 'search',      label: 'Find a Teacher',   route: '/browse-skills',   color: 'teal'   },
    { icon: 'account_balance_wallet', label: 'My Wallet', route: '/wallet',       color: 'purple' },
    { icon: 'history',     label: 'Session History',  route: '/session-history', color: 'blue'   },
    { icon: 'chat',        label: 'Messages',         route: '/chat',            color: 'coral'  },
    { icon: 'person',      label: 'My Profile',       route: '/my-profile',      color: 'pink'   },
    { icon: 'settings',    label: 'Settings',         route: '/settings',        color: 'amber'  },
  ];

  protected statCards = computed(() => {
    const upcoming = [...this.upcomingSessions()].sort((a, b) => a.date.localeCompare(b.date));
    const user = this.auth.currentUser();
    return [
      {
        label: 'Credit Balance', value: user?.credits ?? 0, suffix: 'credits', icon: 'account_balance_wallet', color: 'teal',
        delta: this.onHold() > 0 ? `${this.onHold()} on hold` : 'Available now', trend: 'neutral',
      },
      {
        label: 'Sessions Completed', value: this.completedSessions().length, suffix: 'sessions', icon: 'check_circle', color: 'purple',
        delta: `${this.cancelledSessions().length} cancelled`, trend: 'up',
      },
      {
        label: 'Upcoming Sessions', value: upcoming.length, suffix: 'booked', icon: 'event', color: 'blue',
        delta: upcoming.length ? `Next: ${upcoming[0].date}` : 'Nothing booked', trend: 'neutral',
      },
      {
        label: 'Your Rating', value: user?.rating ?? 0, suffix: '/ 5', icon: 'star', color: 'amber',
        delta: `${user?.ratingCount ?? 0} reviews`, trend: 'up',
      },
    ];
  });

  ngOnInit(): void {
    this.auth.refreshProfile().catch(() => undefined);
    this.bookingService.list().subscribe({ next: (s) => this.sessionList.set(s), error: () => undefined });
    this.bookingService.transactions().subscribe({ next: (t) => this.transactionList.set(t), error: () => undefined });
    const id = this.auth.currentUser()?.id;
    if (id) this.teacherService.getReviews(id).subscribe({ next: (r) => this.reviewList.set(r), error: () => undefined });
  }

  setTab(tab: 'overview' | 'sessions' | 'credits' | 'notifications'): void {
    this.activeTab.set(tab);
  }

  markAllRead(): void {
    this.notifService.markAllRead();
  }

  markRead(id: string): void {
    this.notifService.markRead(id);
  }
}
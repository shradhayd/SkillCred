import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { SESSIONS, TRANSACTIONS, NOTIFICATIONS, REVIEWS, WALLET_CHART_DATA } from '../../shared/mock-data';

@Component({
  selector: 'app-user-panel',
  imports: [RouterLink, MatButtonModule, MatIconModule, Navbar, Footer],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css',
})
export class UserPanel {
  protected auth = inject(AuthService);

  protected activeTab = signal<'overview' | 'sessions' | 'credits' | 'notifications'>('overview');

  protected sessions    = SESSIONS;
  protected transactions = TRANSACTIONS;
  protected notifications = signal([...NOTIFICATIONS]);
  protected reviews     = REVIEWS;
  protected chartData   = WALLET_CHART_DATA;

  protected upcomingSessions  = computed(() => this.sessions.filter(s => s.status === 'upcoming'));
  protected completedSessions = computed(() => this.sessions.filter(s => s.status === 'completed'));
  protected cancelledSessions = computed(() => this.sessions.filter(s => s.status === 'cancelled'));
  protected unreadCount       = computed(() => this.notifications().filter(n => !n.read).length);

  protected totalEarned = computed(() =>
    this.transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.credits, 0)
  );
  protected totalSpent = computed(() =>
    this.transactions.filter(t => t.type === 'spent').reduce((sum, t) => sum + t.credits, 0)
  );

  protected get maxChartValue(): number {
    return Math.max(...this.chartData.map(d => Math.max(d.earned, d.spent)));
  }

  protected quickActions = [
    { icon: 'search',      label: 'Find a Teacher',   route: '/browse-skills',   color: 'teal'   },
    { icon: 'account_balance_wallet', label: 'My Wallet', route: '/wallet',       color: 'purple' },
    { icon: 'history',     label: 'Session History',  route: '/session-history', color: 'blue'   },
    { icon: 'chat',        label: 'Messages',         route: '/chat',            color: 'coral'  },
    { icon: 'person',      label: 'My Profile',       route: '/my-profile',      color: 'pink'   },
    { icon: 'settings',    label: 'Settings',         route: '/settings',        color: 'amber'  },
  ];

  protected statCards = computed(() => [
    {
      label:   'Credit Balance',
      value:   this.auth.currentUser()?.credits ?? 0,
      suffix:  'credits',
      icon:    'account_balance_wallet',
      color:   'teal',
      delta:   '+15 this week',
      trend:   'up',
    },
    {
      label:   'Sessions Completed',
      value:   this.completedSessions().length,
      suffix:  'sessions',
      icon:    'check_circle',
      color:   'purple',
      delta:   '+2 this month',
      trend:   'up',
    },
    {
      label:   'Upcoming Sessions',
      value:   this.upcomingSessions().length,
      suffix:  'booked',
      icon:    'event',
      color:   'blue',
      delta:   'Next: Aug 12',
      trend:   'neutral',
    },
    {
      label:   'Your Rating',
      value:   this.auth.currentUser()?.rating ?? 0,
      suffix:  '/ 5',
      icon:    'star',
      color:   'amber',
      delta:   `${this.reviews.length} reviews`,
      trend:   'up',
    },
  ]);

  setTab(tab: 'overview' | 'sessions' | 'credits' | 'notifications'): void {
    this.activeTab.set(tab);
  }

  markAllRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  markRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }
}

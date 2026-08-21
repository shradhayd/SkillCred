import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Navbar } from '../../shared/layout/navbar';
import { AuthService } from '../../core/auth.service';
import { REPORTS, WALLET_CHART_DATA } from '../../shared/mock-data';
import { Report } from '../../shared/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    FormsModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    Navbar,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  protected auth = inject(AuthService);

  protected activeSection = signal<'overview' | 'users' | 'sessions' | 'reports' | 'categories' | 'settings'>('overview');
  protected sidebarCollapsed = signal(false);
  protected reportSearch = '';
  protected reportFilter = 'all';
  protected userSearch   = '';

  protected reports  = signal<Report[]>([...REPORTS]);
  protected chartData = WALLET_CHART_DATA;

  protected openReportCount      = computed(() => this.reports().filter(r => r.status === 'open').length);
  protected resolvedReportCount  = computed(() => this.reports().filter(r => r.status === 'resolved').length);
  protected dismissedReportCount = computed(() => this.reports().filter(r => r.status === 'dismissed').length);

  protected navItems = [
    { id: 'overview',   label: 'Overview',   icon: 'dashboard' },
    { id: 'users',      label: 'Users',       icon: 'people'    },
    { id: 'sessions',   label: 'Sessions',    icon: 'event'     },
    { id: 'reports',    label: 'Reports',     icon: 'flag'      },
    { id: 'categories', label: 'Categories',  icon: 'category'  },
    { id: 'settings',   label: 'Settings',    icon: 'settings'  },
  ] as const;

  protected statCards = [
    { label: 'Total Users',         value: '1,247',  delta: '+12%', up: true,  icon: 'people',                 color: 'teal'   },
    { label: 'Active Sessions',     value: '89',     delta: '+5%',  up: true,  icon: 'event',                  color: 'purple' },
    { label: 'Credits Circulated',  value: '45,680', delta: '+8%',  up: true,  icon: 'account_balance_wallet', color: 'blue'   },
    { label: 'Open Reports',        value: '4',      delta: '−3',   up: false, icon: 'flag',                   color: 'coral'  },
  ];

  protected monthlyData = [
    { month: 'Mar', users: 820,  sessions: 310 },
    { month: 'Apr', users: 940,  sessions: 380 },
    { month: 'May', users: 1020, sessions: 420 },
    { month: 'Jun', users: 1085, sessions: 510 },
    { month: 'Jul', users: 1160, sessions: 590 },
    { month: 'Aug', users: 1247, sessions: 640 },
  ];

  protected get maxUsers()    { return Math.max(...this.monthlyData.map(d => d.users)); }
  protected get maxSessions() { return Math.max(...this.monthlyData.map(d => d.sessions)); }
  protected get maxChart()    { return Math.max(...this.chartData.map(d => Math.max(d.earned, d.spent))); }

  protected categoryStats = [
    { name: 'Coding',    pct: 34, icon: '💻', color: 'teal'   },
    { name: 'Design',    pct: 22, icon: '🎨', color: 'purple' },
    { name: 'Music',     pct: 18, icon: '🎵', color: 'blue'   },
    { name: 'Languages', pct: 15, icon: '🌍', color: 'coral'  },
    { name: 'Cooking',   pct: 11, icon: '🍳', color: 'pink'   },
  ];

  protected recentActivity = [
    { icon: 'person_add', color: 'teal',   msg: 'New user registered: Sophie T.',       time: '2 min ago'  },
    { icon: 'flag',       color: 'coral',  msg: 'Report filed against BadActor1',        time: '15 min ago' },
    { icon: 'event',      color: 'purple', msg: 'Session completed: Angular Basics',     time: '1 hr ago'   },
    { icon: 'star',       color: 'blue',   msg: '5-star review left by Rahul K.',        time: '2 hr ago'   },
    { icon: 'check',      color: 'teal',   msg: 'Report #rp3 resolved by admin',         time: '3 hr ago'   },
    { icon: 'person_add', color: 'teal',   msg: 'New user registered: Kenji T.',         time: '5 hr ago'   },
    { icon: 'event',      color: 'purple', msg: 'Session booked: Japanese Conversation', time: '6 hr ago'   },
    { icon: 'warning',    color: 'coral',  msg: 'Credit anomaly flagged for review',     time: 'Yesterday'  },
  ];

  protected mockUsers = signal([
    { id: 'u1', name: 'Alex Chen',     email: 'alex@example.com',   role: 'teacher', status: 'active',    joined: '2025-03-12', credits: 240, sessions: 48 },
    { id: 'u2', name: 'Maria Garcia',  email: 'maria@example.com',  role: 'teacher', status: 'active',    joined: '2025-04-01', credits: 180, sessions: 36 },
    { id: 'u3', name: 'Shradha Kumar', email: 'shradha@gmail.com',  role: 'admin',   status: 'active',    joined: '2023-01-15', credits: 120, sessions: 22 },
    { id: 'u4', name: 'James Wilson',  email: 'james@example.com',  role: 'teacher', status: 'inactive',  joined: '2025-06-10', credits: 60,  sessions: 12 },
    { id: 'u5', name: 'Kenji Tanaka',  email: 'kenji@example.com',  role: 'teacher', status: 'active',    joined: '2025-05-20', credits: 310, sessions: 61 },
    { id: 'u6', name: 'Sophie Turner', email: 'sophie@example.com', role: 'teacher', status: 'active',    joined: '2025-02-28', credits: 275, sessions: 54 },
    { id: 'u7', name: 'Emma Davis',    email: 'emma@example.com',   role: 'student', status: 'active',    joined: '2026-01-05', credits: 45,  sessions: 9  },
    { id: 'u8', name: 'Carlos Ruiz',   email: 'carlos@example.com', role: 'teacher', status: 'suspended', joined: '2025-09-14', credits: 0,   sessions: 7  },
  ]);

  protected mockSessions = [
    { skill: 'Angular Basics',      student: 'Rahul K.',    teacher: 'Shradha',       date: '2026-08-12', time: '10:00 AM', credits: 15, status: 'upcoming'  },
    { skill: 'Guitar Lesson',       student: 'Shradha',     teacher: 'Maria Garcia',  date: '2026-08-15', time: '3:00 PM',  credits: 12, status: 'upcoming'  },
    { skill: 'TypeScript Advanced', student: 'Priya S.',    teacher: 'Shradha',       date: '2026-07-25', time: '11:00 AM', credits: 18, status: 'completed' },
    { skill: 'Python Intro',        student: 'Shradha',     teacher: 'Alex Chen',     date: '2026-07-05', time: '9:00 AM',  credits: 15, status: 'cancelled' },
    { skill: 'UI/UX Design',        student: 'Kenji T.',    teacher: 'Sophie Turner', date: '2026-08-10', time: '2:00 PM',  credits: 18, status: 'upcoming'  },
    { skill: 'Japanese Intro',      student: 'Emma Davis',  teacher: 'Kenji Tanaka',  date: '2026-07-30', time: '4:00 PM',  credits: 14, status: 'completed' },
  ];

  protected get activeLabel() {
    return this.navItems.find(n => n.id === this.activeSection())?.label ?? '';
  }

  protected get filteredReports() {
    return this.reports().filter(r => {
      const q = this.reportSearch.toLowerCase();
      const matchQ = !q ||
        r.reporter.toLowerCase().includes(q) ||
        r.reportedUser.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      const matchF = this.reportFilter === 'all' || r.status === this.reportFilter;
      return matchQ && matchF;
    });
  }

  protected get filteredUsers() {
    const q = this.userSearch.toLowerCase();
    if (!q) return this.mockUsers();
    return this.mockUsers().filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }

  selectSection(id: string): void   { this.activeSection.set(id as any); }
  toggleSidebar(): void              { this.sidebarCollapsed.update(v => !v); }

  resolveReport(r: Report): void {
    this.reports.update(list => list.map(x => x.id === r.id ? { ...x, status: 'resolved' as const } : x));
  }
  dismissReport(r: Report): void {
    this.reports.update(list => list.map(x => x.id === r.id ? { ...x, status: 'dismissed' as const } : x));
  }
  toggleSuspend(uid: string): void {
    this.mockUsers.update(list =>
      list.map(u => u.id === uid ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u)
    );
  }
}

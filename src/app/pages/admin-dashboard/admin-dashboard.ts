import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { ADMIN_STATS, REPORTS } from '../../shared/mock-data';
import { Report } from '../../shared/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DecimalPipe, MatButtonModule, MatIconModule, MatTableModule, Navbar, Footer],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  protected auth = inject(AuthService);
  protected stats = ADMIN_STATS;
  protected reports = [...REPORTS];
  protected activeSection = 'reports';
  protected displayedColumns = ['reporter', 'reportedUser', 'reason', 'status', 'actions'];

  protected navItems = [
    { id: 'users', label: 'Users', icon: 'people' },
    { id: 'sessions', label: 'Sessions', icon: 'event' },
    { id: 'reports', label: 'Reports', icon: 'flag' },
    { id: 'categories', label: 'Categories', icon: 'category' },
  ];

  protected get activeNavItem() {
    return this.navItems.find(n => n.id === this.activeSection);
  }

  selectSection(id: string): void {
    this.activeSection = id;
  }

  resolveReport(report: Report): void {
    report.status = 'resolved';
  }

  dismissReport(report: Report): void {
    report.status = 'dismissed';
  }
}

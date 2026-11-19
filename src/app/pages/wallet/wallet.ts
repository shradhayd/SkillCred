import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { BookingService } from '../../core/booking.service';
import { Transaction } from '../../shared/models';
import { TransactionDetailDialog } from './transaction-detail-dialog';

interface ChartMonth {
  month: string;
  earned: number;
  spent: number;
}

@Component({
  selector: 'app-wallet',
  imports: [MatButtonModule, MatIconModule, Navbar, Footer],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet implements OnInit {
  protected auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private bookingService = inject(BookingService);

  protected transactions: Transaction[] = [];
  protected chartData: ChartMonth[] = this.buildChart([]);
  protected loading = true;
  protected loadError = false;

  // Only completed transactions count. Pending ones are credits held for upcoming sessions.
  protected get creditsEarned(): number {
    return this.sum('earned');
  }

  protected get creditsSpent(): number {
    return this.sum('spent');
  }

  protected get creditsOnHold(): number {
    return this.transactions
      .filter((t) => t.type === 'spent' && t.status === 'pending')
      .reduce((total, t) => total + t.credits, 0);
  }

  protected get maxChartValue(): number {
    return Math.max(1, ...this.chartData.flatMap((d) => [d.earned, d.spent]));
  }

  ngOnInit(): void {
    this.auth.refreshProfile().catch(() => undefined); // make sure the balance is up to date
    this.bookingService.transactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.chartData = this.buildChart(transactions);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      },
    });
  }

  openDetail(tx: Transaction): void {
    this.dialog.open(TransactionDetailDialog, {
      width: '420px',
      data: tx,
    });
  }

  private sum(type: 'earned' | 'spent'): number {
    return this.transactions
      .filter((t) => t.type === type && t.status === 'completed')
      .reduce((total, t) => total + t.credits, 0);
  }

  /** Last 6 months, earned and spent credits per month (completed transactions only). */
  private buildChart(transactions: Transaction[]): ChartMonth[] {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString('en-US', { month: 'short' }),
        earned: 0,
        spent: 0,
      });
    }

    for (const t of transactions) {
      if (t.status !== 'completed' || !t.createdAt) continue;
      const d = new Date(t.createdAt);
      const bucket = months.find((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (!bucket) continue;
      if (t.type === 'earned') bucket.earned += t.credits;
      else bucket.spent += t.credits;
    }

    return months.map(({ month, earned, spent }) => ({ month, earned, spent }));
  }
}
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TRANSACTIONS, WALLET_CHART_DATA } from '../../shared/mock-data';
import { Transaction } from '../../shared/models';
import { TransactionDetailDialog } from './transaction-detail-dialog';

@Component({
  selector: 'app-wallet',
  imports: [MatButtonModule, MatIconModule, Navbar, Footer],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet {
  protected auth = inject(AuthService);
  private dialog = inject(MatDialog);
  protected transactions = TRANSACTIONS;
  protected chartData = WALLET_CHART_DATA;

  protected get creditsEarned(): number {
    return this.transactions.filter(t => t.type === 'earned').reduce((s, t) => s + t.credits, 0);
  }

  protected get creditsSpent(): number {
    return this.transactions.filter(t => t.type === 'spent').reduce((s, t) => s + t.credits, 0);
  }

  protected get maxChartValue(): number {
    return Math.max(...this.chartData.flatMap(d => [d.earned, d.spent]));
  }

  openDetail(tx: Transaction): void {
    this.dialog.open(TransactionDetailDialog, {
      width: '420px',
      data: tx,
    });
  }
}

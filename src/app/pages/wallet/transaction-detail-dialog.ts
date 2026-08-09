import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Transaction } from '../../shared/models';

@Component({
  selector: 'app-transaction-detail-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Transaction Details</h2>
    <mat-dialog-content>
      <div class="detail-row"><strong>Skill:</strong> {{ data.skill }}</div>
      <div class="detail-row"><strong>Date:</strong> {{ data.date }}</div>
      <div class="detail-row"><strong>Time:</strong> {{ data.timeSlot }}</div>
      <div class="detail-row"><strong>With:</strong> {{ data.withWhom }}</div>
      <div class="detail-row"><strong>Credits:</strong> {{ data.type === 'earned' ? '+' : '-' }}{{ data.credits }}</div>
      <div class="detail-row"><strong>Status:</strong> <span class="status-badge status-{{ data.status }}">{{ data.status }}</span></div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detail-row { margin-bottom: 0.75rem; }
    .detail-row strong { display: inline-block; width: 80px; }
  `],
})
export class TransactionDetailDialog {
  data = inject<Transaction>(MAT_DIALOG_DATA);
}

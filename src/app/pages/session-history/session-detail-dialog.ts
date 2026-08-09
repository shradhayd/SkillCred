import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Session } from '../../shared/models';

@Component({
  selector: 'app-session-detail-dialog',
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Session Details</h2>
    <mat-dialog-content>
      <div class="detail-row"><strong>Skill:</strong> {{ data.skill }}</div>
      <div class="detail-row"><strong>Date:</strong> {{ data.date }}</div>
      <div class="detail-row"><strong>Time:</strong> {{ data.timeSlot }}</div>
      <div class="detail-row"><strong>With:</strong> {{ data.withWhom }}</div>
      <div class="detail-row"><strong>Credits:</strong> {{ data.credits }}</div>
      <div class="detail-row"><strong>Status:</strong> <span class="status-badge status-{{ data.status }}">{{ data.status }}</span></div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="message()">
        <mat-icon>chat</mat-icon> Message
      </button>
      @if (data.status === 'completed') {
        <button mat-flat-button class="btn-primary" (click)="review()">Leave Review</button>
      }
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detail-row { margin-bottom: 0.75rem; }
    .detail-row strong { display: inline-block; width: 80px; }
  `],
})
export class SessionDetailDialog {
  data = inject<Session>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<SessionDetailDialog>);

  message(): void {
    this.dialogRef.close('message');
  }

  review(): void {
    this.dialogRef.close('review');
  }
}

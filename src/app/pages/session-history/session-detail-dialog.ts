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
      @if (data.message) {
        <div class="detail-row"><strong>Note:</strong> {{ data.message }}</div>
      }
      @if (data.status === 'upcoming') {
        <p class="note">
          @if (data.role === 'student') {
            After the session, tap "Mark as completed" to send the credits to the teacher.
          } @else {
            The student marks the session as completed, then you receive the credits.
          }
        </p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="message()">
        <mat-icon>chat</mat-icon> Message
      </button>
      @if (data.status === 'upcoming') {
        <button mat-stroked-button color="warn" (click)="cancel()">Cancel Session</button>
      }
      @if (canComplete) {
        <button mat-flat-button class="btn-primary" (click)="complete()">Mark as completed</button>
      }
      @if (canReview) {
        <button mat-flat-button class="btn-primary" (click)="review()">Leave Review</button>
      }
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detail-row { margin-bottom: 0.75rem; }
    .detail-row strong { display: inline-block; width: 80px; }
    .note { font-size: 0.85rem; color: var(--text-muted); margin: 1rem 0 0; }
  `],
})
export class SessionDetailDialog {
  data = inject<Session>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<SessionDetailDialog>);

  /** Only the student can complete, and only on or after the session date. */
  protected get canComplete(): boolean {
    return this.data.status === 'upcoming' && this.data.role === 'student' && this.data.date <= this.today();
  }

  protected get canReview(): boolean {
    return this.data.status === 'completed' && this.data.role === 'student' && !this.data.reviewed;
  }

  message(): void {
    this.dialogRef.close('message');
  }

  cancel(): void {
    this.dialogRef.close('cancel');
  }

  complete(): void {
    this.dialogRef.close('complete');
  }

  review(): void {
    this.dialogRef.close('review');
  }

  private today(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}
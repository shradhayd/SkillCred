import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-success-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Booking Confirmed! 🎉</h2>
    <mat-dialog-content>
      <p>Your session has been successfully booked. You'll receive a confirmation shortly.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="goChat()">Go to Chat</button>
      <button mat-flat-button class="btn-primary" (click)="goHome()">Back to Home</button>
    </mat-dialog-actions>
  `,
})
export class BookingSuccessDialog {
  private dialogRef = inject(MatDialogRef<BookingSuccessDialog>);
  private router = inject(Router);

  goChat(): void {
    this.dialogRef.close('chat');
  }

  goHome(): void {
    this.dialogRef.close('home');
  }
}

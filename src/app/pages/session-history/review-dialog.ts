import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BookingService, apiErrorMessage } from '../../core/booking.service';
import { Session } from '../../shared/models';

@Component({
  selector: 'app-review-dialog',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Leave a Review</h2>
    <mat-dialog-content>
      <p>How was your session on <strong>{{ data.skill }}</strong>?</p>
      <div class="stars">
        @for (star of [1,2,3,4,5]; track star) {
          <button mat-icon-button type="button" (click)="rating = star">
            <mat-icon>{{ star <= rating ? 'star' : 'star_border' }}</mat-icon>
          </button>
        }
      </div>
      <mat-form-field appearance="outline" class="full-width">
        <textarea matInput rows="3" maxlength="500" placeholder="Share your experience..." [(ngModel)]="comment"></textarea>
      </mat-form-field>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button class="btn-primary" [disabled]="submitting" (click)="submit()">
        {{ submitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .stars { display: flex; margin: 1rem 0; }
    .stars mat-icon { color: #d69e2e; }
    .full-width { width: 100%; }
    .error { color: #e53e3e; font-size: 0.9rem; margin: 0; }
  `],
})
export class ReviewDialog {
  data = inject<Session>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ReviewDialog>);
  private bookingService = inject(BookingService);

  protected rating = 5;
  protected comment = '';
  protected submitting = false;
  protected error = '';

  async submit(): Promise<void> {
    if (this.submitting) return;
    this.submitting = true;
    this.error = '';
    try {
      await firstValueFrom(this.bookingService.review(this.data.id, this.rating, this.comment));
      this.dialogRef.close(true);
    } catch (err) {
      this.error = apiErrorMessage(err);
      this.submitting = false;
    }
  }
}
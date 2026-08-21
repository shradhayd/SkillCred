import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
          <button mat-icon-button (click)="rating = star">
            <mat-icon>{{ star <= rating ? 'star' : 'star_border' }}</mat-icon>
          </button>
        }
      </div>
      <mat-form-field appearance="outline" class="full-width">
        <textarea matInput rows="3" placeholder="Share your experience..." [(ngModel)]="comment"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button class="btn-primary" mat-dialog-close>Submit Review</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .stars { display: flex; margin: 1rem 0; }
    .stars mat-icon { color: #d69e2e; }
    .full-width { width: 100%; }
  `],
})
export class ReviewDialog {
  data = inject<Session>(MAT_DIALOG_DATA);
  protected rating = 5;
  protected comment = '';
}

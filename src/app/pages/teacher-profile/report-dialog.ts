import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { apiErrorMessage } from '../../core/booking.service';

@Component({
  selector: 'app-report-dialog',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Report {{ data.name }}</h2>
    <mat-dialog-content>
      <p>Tell us what went wrong. Our team will review it.</p>
      <mat-form-field appearance="outline" class="full-width">
        <textarea matInput rows="4" maxlength="500" placeholder="Describe the problem (at least 10 characters)..." [(ngModel)]="reason"></textarea>
      </mat-form-field>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [disabled]="submitting" (click)="submit()">
        {{ submitting ? 'Sending...' : 'Submit Report' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    .error { color: #e53e3e; font-size: 0.9rem; margin: 0; }
  `],
})
export class ReportDialog {
  data = inject<{ id: string; name: string }>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<ReportDialog>);
  private api = inject(ApiService);

  protected reason = '';
  protected submitting = false;
  protected error = '';

  async submit(): Promise<void> {
    if (this.submitting) return;
    this.submitting = true;
    this.error = '';
    try {
      await firstValueFrom(this.api.post('/reports', { reportedUserId: this.data.id, reason: this.reason }));
      this.ref.close(true);
    } catch (err) {
      this.error = apiErrorMessage(err);
      this.submitting = false;
    }
  }
}
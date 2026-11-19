import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, firstValueFrom } from 'rxjs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { BookingService, apiErrorMessage } from '../../core/booking.service';
import { Session } from '../../shared/models';
import { SessionDetailDialog } from './session-detail-dialog';
import { ReviewDialog } from './review-dialog';

@Component({
  selector: 'app-session-history',
  imports: [FormsModule, MatButtonModule, MatIconModule, Navbar, Footer],
  templateUrl: './session-history.html',
  styleUrl: './session-history.css',
})
export class SessionHistory implements OnInit {
  protected auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private bookingService = inject(BookingService);

  protected sessions: Session[] = [];
  protected loading = true;
  protected loadError = false;

  ngOnInit(): void {
    this.load();
  }

  openDetail(session: Session): void {
    const ref = this.dialog.open(SessionDetailDialog, {
      width: '440px',
      data: session,
    });

    ref.afterClosed().subscribe((action) => {
      if (action === 'message') {
        this.router.navigate(['/chat']);
      } else if (action === 'cancel') {
        if (!confirm('Cancel this session? The student gets the held credits back.')) return;
        this.run(
          () => this.bookingService.cancel(session.id),
          session.role === 'student'
            ? 'Session cancelled. Your credits were refunded.'
            : 'Session cancelled. The student was refunded.'
        );
      } else if (action === 'complete') {
        this.run(
          () => this.bookingService.complete(session.id),
          'Session marked as completed. The credits were sent to the teacher.'
        );
      } else if (action === 'review') {
        this.dialog
          .open(ReviewDialog, { width: '420px', data: session })
          .afterClosed()
          .subscribe((done) => {
            if (done) {
              this.snackBar.open('Thanks for your review!', 'OK', { duration: 3500 });
              this.load();
            }
          });
      }
    });
  }

  private load(): void {
    this.bookingService.list().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.loading = false;
        this.loadError = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      },
    });
  }

  /** Runs a booking action, refreshes the balance and the list, and tells the user what happened. */
  private async run(action: () => Observable<unknown>, successMessage: string): Promise<void> {
    try {
      await firstValueFrom(action());
      this.snackBar.open(successMessage, 'OK', { duration: 4000 });
    } catch (err) {
      this.snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
    }
    await this.auth.refreshProfile().catch(() => undefined);
    this.load();
  }
}
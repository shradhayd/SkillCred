import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { SESSIONS } from '../../shared/mock-data';
import { Session } from '../../shared/models';
import { SessionDetailDialog } from './session-detail-dialog';
import { ReviewDialog } from './review-dialog';

@Component({
  selector: 'app-session-history',
  imports: [FormsModule, MatButtonModule, MatIconModule, Navbar, Footer],
  templateUrl: './session-history.html',
  styleUrl: './session-history.css',
})
export class SessionHistory {
  protected auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  protected sessions = SESSIONS;

  openDetail(session: Session): void {
    const ref = this.dialog.open(SessionDetailDialog, {
      width: '440px',
      data: session,
    });
    ref.afterClosed().subscribe(action => {
      if (action === 'message') {
        this.router.navigate(['/chat']);
      } else if (action === 'review') {
        this.dialog.open(ReviewDialog, { width: '420px', data: session });
      }
    });
  }
}

import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TeacherService } from '../../core/teacher.service';
import { BookingService, apiErrorMessage } from '../../core/booking.service';
import { TIME_SLOTS } from '../../shared/mock-data';
import { Teacher } from '../../shared/models';
import { BookingSuccessDialog } from './booking-success-dialog';

@Component({
  selector: 'app-booking',
  imports: [
    FormsModule, RouterLink, DatePipe, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    Navbar, Footer,
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  protected auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private teacherService = inject(TeacherService);
  private bookingService = inject(BookingService);

  protected teacher: Teacher | undefined;
  protected loading = true;
  protected submitting = false;
  protected timeSlots = TIME_SLOTS;
  protected bookedSlots: string[] = [];
  protected minDate = new Date();
  protected selectedDate: Date | null = null;
  protected selectedSlot = '';
  protected message = '';

  protected get notEnoughCredits(): boolean {
    const credits = this.auth.currentUser()?.credits ?? 0;
    return !!this.teacher && credits < this.teacher.creditsRequired;
  }

  protected get isOwnProfile(): boolean {
    return !!this.teacher && this.teacher.id === this.auth.currentUser()?.id;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('teacherId');
    if (!id) {
      this.loading = false;
      return;
    }
    this.teacherService.getTeacher(id).subscribe({
      next: (teacher) => {
        this.teacher = teacher;
        this.loading = false;
      },
      error: () => {
        this.teacher = undefined;
        this.loading = false;
      },
    });
  }

  /** Called when the date changes: asks the backend which slots are already taken that day. */
  onDateChange(): void {
    this.bookedSlots = [];
    if (!this.teacher || !this.selectedDate) return;

    const date = this.toDateString(this.selectedDate);
    this.bookingService.bookedSlots(this.teacher.id, date).subscribe({
      next: (res) => {
        // Ignore a late answer if the user already picked another date.
        if (!this.selectedDate || this.toDateString(this.selectedDate) !== date) return;
        this.bookedSlots = res.bookedSlots;
        if (this.bookedSlots.includes(this.selectedSlot)) this.selectedSlot = '';
      },
      error: () => (this.bookedSlots = []),
    });
  }

  selectSlot(slot: string): void {
    if (this.bookedSlots.includes(slot)) return;
    this.selectedSlot = slot;
  }

  async confirmBooking(): Promise<void> {
    if (!this.teacher || !this.selectedDate || !this.selectedSlot || this.submitting) return;

    this.submitting = true;
    try {
      await firstValueFrom(
        this.bookingService.create({
          teacherId: this.teacher.id,
          date: this.toDateString(this.selectedDate),
          timeSlot: this.selectedSlot,
          message: this.message,
        })
      );
    } catch (err) {
      this.snackBar.open(apiErrorMessage(err), 'Close', { duration: 6000 });
      this.onDateChange(); // the slot may have just been taken by someone else
      this.submitting = false;
      return;
    }

    // Booking is done. A failing balance refresh must not look like a failed booking.
    await this.auth.refreshProfile().catch(() => undefined);
    this.submitting = false;

    const ref = this.dialog.open(BookingSuccessDialog, { width: '400px' });
    ref.afterClosed().subscribe((action) => {
      if (action === 'chat') {
        this.router.navigate(['/chat']);
      } else {
        this.router.navigate(['/session-history']);
      }
    });
  }

  /** Local calendar date as YYYY-MM-DD (toISOString() would shift the day in some timezones). */
  private toDateString(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}
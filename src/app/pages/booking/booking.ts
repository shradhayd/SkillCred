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
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TEACHERS, TIME_SLOTS } from '../../shared/mock-data';
import { TeacherService } from '../../core/teacher.service';
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
  private teacherService = inject(TeacherService);

  protected teacher: Teacher | undefined;
  protected loading = true;
  protected timeSlots = TIME_SLOTS;
  protected selectedDate: Date | null = null;
  protected selectedSlot = '';
  protected message = '';

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

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  confirmBooking(): void {
    if (!this.selectedDate || !this.selectedSlot) return;
    const ref = this.dialog.open(BookingSuccessDialog, { width: '400px' });
    ref.afterClosed().subscribe(action => {
      if (action === 'chat') {
        this.router.navigate(['/chat']);
      } else if (action === 'home') {
        this.router.navigate(['/home']);
      }
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TeacherService } from '../../core/teacher.service';
import { BookingService } from '../../core/booking.service';
import { Review, Session } from '../../shared/models';

@Component({
  selector: 'app-my-profile',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTabsModule, Navbar, Footer],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {
  protected auth = inject(AuthService);
  private teacherService = inject(TeacherService);
  private bookingService = inject(BookingService);

  protected reviews: Review[] = [];
  protected sessions: Session[] = [];

  ngOnInit(): void {
    this.bookingService.list().subscribe({
      next: (sessions) => (this.sessions = sessions),
      error: () => (this.sessions = []),
    });

    const id = this.auth.currentUser()?.id;
    if (!id) return;
    this.teacherService.getReviews(id).subscribe({
      next: (reviews) => (this.reviews = reviews),
      error: () => (this.reviews = []),
    });
  }
}
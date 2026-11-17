import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TeacherService } from '../../core/teacher.service';
import { SESSIONS } from '../../shared/mock-data';
import { Review } from '../../shared/models';

@Component({
  selector: 'app-my-profile',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTabsModule, Navbar, Footer],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {
  protected auth = inject(AuthService);
  private teacherService = inject(TeacherService);

  protected reviews: Review[] = [];
  protected sessions = SESSIONS; // still demo data, becomes real in Step 5 (bookings)

  ngOnInit(): void {
    const id = this.auth.currentUser()?.id;
    if (!id) return;
    this.teacherService.getReviews(id).subscribe({
      next: (reviews) => (this.reviews = reviews),
      error: () => (this.reviews = []),
    });
  }
}
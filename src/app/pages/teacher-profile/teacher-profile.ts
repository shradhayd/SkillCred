import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TeacherService } from '../../core/teacher.service';
import { Review, Teacher } from '../../shared/models';

@Component({
  selector: 'app-teacher-profile',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTabsModule, Navbar, Footer],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})
export class TeacherProfile implements OnInit {
  protected auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private teacherService = inject(TeacherService);

  protected teacher: Teacher | undefined;
  protected reviews: Review[] = [];
  protected loading = true;

  ngOnInit(): void {
    // paramMap (not snapshot) so moving from one teacher to another also reloads the data
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.loading = true;
      this.teacher = undefined;
      this.reviews = [];

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

      this.teacherService.getReviews(id).subscribe({
        next: (reviews) => (this.reviews = reviews),
        error: () => (this.reviews = []),
      });
    });
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TEACHERS, REVIEWS, SESSIONS } from '../../shared/mock-data';
import { Teacher } from '../../shared/models';

@Component({
  selector: 'app-teacher-profile',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTabsModule, Navbar, Footer],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})
export class TeacherProfile implements OnInit {
  protected auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  protected teacher: Teacher | undefined;
  protected reviews = REVIEWS;
  protected sessions = SESSIONS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.teacher = TEACHERS.find(t => t.id === id);
  }
}

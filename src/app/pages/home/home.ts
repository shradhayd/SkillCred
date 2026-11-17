import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TeacherService } from '../../core/teacher.service';
import { SkillCategory } from '../../shared/models';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected auth = inject(AuthService);
  private teacherService = inject(TeacherService);
  protected categories: SkillCategory[] = [];
  protected searchQuery = '';

  ngOnInit(): void {
    this.teacherService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: () => (this.categories = []),
    });
  }
}
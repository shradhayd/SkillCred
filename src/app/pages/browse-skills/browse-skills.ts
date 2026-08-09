import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TEACHERS, SKILL_CATEGORIES } from '../../shared/mock-data';
import { Teacher } from '../../shared/models';

@Component({
  selector: 'app-browse-skills',
  imports: [
    FormsModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule,
    MatSlideToggleModule, Navbar, Footer,
  ],
  templateUrl: './browse-skills.html',
  styleUrl: './browse-skills.css',
})
export class BrowseSkills implements OnInit {
  protected auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected categories = SKILL_CATEGORIES;
  protected allTeachers = TEACHERS;
  protected filteredTeachers: Teacher[] = [];
  protected searchQuery = '';
  protected sortBy = 'rating';
  protected selectedCategories: string[] = [];
  protected experienceLevel = '';
  protected onlineOnly = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategories = [params['category']];
      }
      this.applyFilters();
    });
  }

  toggleCategory(id: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedCategories.includes(id)) {
        this.selectedCategories.push(id);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== id);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allTeachers];

    if (this.selectedCategories.length) {
      result = result.filter(t => this.selectedCategories.includes(t.category));
    }
    if (this.experienceLevel) {
      result = result.filter(t => t.experienceLevel === this.experienceLevel);
    }
    if (this.onlineOnly) {
      result = result.filter(t => t.isOnline);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.skill.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    if (this.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'credits-low') {
      result.sort((a, b) => a.creditsRequired - b.creditsRequired);
    } else if (this.sortBy === 'credits-high') {
      result.sort((a, b) => b.creditsRequired - a.creditsRequired);
    }

    this.filteredTeachers = result;
  }

  goToProfile(id: string, event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.request-btn')) return;
    this.router.navigate(['/profile', id]);
  }

  requestSession(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/booking', id]);
  }
}

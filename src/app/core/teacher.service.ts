import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Review, SkillCategory, Teacher } from '../shared/models';
import { ApiService } from './api.service';

/** Public data from the backend: teachers, their reviews and the skill categories. */
@Injectable({ providedIn: 'root' })
export class TeacherService {
  private api = inject(ApiService);

  getTeachers(): Observable<Teacher[]> {
    return this.api.get<Teacher[]>('/users');
  }

  getTeacher(id: string): Observable<Teacher> {
    return this.api.get<Teacher>(`/users/${id}`);
  }

  getReviews(userId: string): Observable<Review[]> {
    return this.api.get<Review[]>(`/users/${userId}/reviews`);
  }

  getCategories(): Observable<SkillCategory[]> {
    return this.api.get<SkillCategory[]>('/categories');
  }
}
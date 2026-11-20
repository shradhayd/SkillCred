import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { TeacherService } from '../../core/teacher.service';
import { SkillCategory } from '../../shared/models';
import { UploadService } from '../../core/upload.service';

type Level = 'Beginner' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatSlideToggleModule, Navbar, Footer,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  protected auth = inject(AuthService);
  private router = inject(Router);
  private teacherService = inject(TeacherService);
  private snackBar = inject(MatSnackBar);
  private uploads = inject(UploadService);

  protected uploadingPhoto = false;

  protected categories: SkillCategory[] = [];

  // Profile
  protected name = '';
  protected bio = '';

  // Notification preferences
  protected emailNotifications = true;
  protected sessionReminders = true;
  protected marketingEmails = false;

  // Teaching profile
  protected isTeacher = false;
  protected skill = '';
  protected category = '';
  protected creditsRequired = 10;
  protected experienceLevel: Level = 'Beginner';
  protected isOnline = true;
  protected skillsTeachText = '';
  protected skillsLearnText = '';

  ngOnInit(): void {
    this.teacherService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: () => (this.categories = []),
    });

    const user = this.auth.currentUser();
    if (!user) return;

    this.name = user.name;
    this.bio = user.bio ?? '';
    this.emailNotifications = user.settings?.emailNotifications ?? true;
    this.sessionReminders = user.settings?.sessionReminders ?? true;
    this.marketingEmails = user.settings?.marketingEmails ?? false;

    this.isTeacher = user.isTeacher ?? false;
    this.skill = user.skill ?? '';
    this.category = user.category ?? '';
    this.creditsRequired = user.creditsRequired || 10;
    this.experienceLevel = user.experienceLevel ?? 'Beginner';
    this.isOnline = user.isOnline ?? true;
    this.skillsTeachText = (user.skillsTeach ?? []).join(', ');
    this.skillsLearnText = (user.skillsLearn ?? []).join(', ');
  }

  async saveProfile(): Promise<void> {
    await this.save({ name: this.name, bio: this.bio }, 'Profile saved');
  }

  async savePreferences(): Promise<void> {
    await this.save(
      {
        settings: {
          emailNotifications: this.emailNotifications,
          sessionReminders: this.sessionReminders,
          marketingEmails: this.marketingEmails,
        },
      },
      'Preferences saved'
    );
  }

  async saveTeaching(): Promise<void> {
    await this.save(
      {
        isTeacher: this.isTeacher,
        skill: this.skill,
        category: this.category,
        creditsRequired: Number(this.creditsRequired),
        experienceLevel: this.experienceLevel,
        isOnline: this.isOnline,
        skillsTeach: this.toList(this.skillsTeachText),
        skillsLearn: this.toList(this.skillsLearnText),
      },
      this.isTeacher ? 'Teaching profile saved. You are now visible in Browse Skills.' : 'Teaching profile saved'
    );
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  deleteAccount(): void {
    // Still only logs out. Real account deletion is added in a later step.
    this.auth.logout();
    this.router.navigate(['/home']);
  }
  /** Called when a file is chosen in the hidden file input. */
  async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // lets the user pick the same file again later
    if (!file || this.uploadingPhoto) return;

    this.uploadingPhoto = true;
    try {
      const url = await this.uploads.uploadAvatar(file);
      await this.auth.saveProfile({ photo: url });
      this.snackBar.open('Profile photo updated', 'OK', { duration: 3500 });
    } catch (err) {
      this.snackBar.open((err as Error).message, 'Close', { duration: 6000 });
    }
    this.uploadingPhoto = false;
  }
  private async save(changes: Record<string, unknown>, successMessage: string): Promise<void> {
    try {
      await this.auth.saveProfile(changes);
      this.snackBar.open(successMessage, 'OK', { duration: 3500 });
    } catch (err) {
      this.snackBar.open((err as Error).message, 'Close', { duration: 6000 });
    }
  }

  /** "Python, Django ,  " -> ['Python', 'Django'] */
  private toList(text: string): string[] {
    return text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
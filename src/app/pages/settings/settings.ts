import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSlideToggleModule, Navbar, Footer,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  protected auth = inject(AuthService);
  private router = inject(Router);

  protected name = this.auth.currentUser()?.name ?? '';
  protected bio = this.auth.currentUser()?.bio ?? '';
  protected emailNotifications = true;
  protected sessionReminders = true;
  protected marketingEmails = false;

  saveProfile(): void {
    // Mock save
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  deleteAccount(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}

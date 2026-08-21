import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { REVIEWS, SESSIONS } from '../../shared/mock-data';

@Component({
  selector: 'app-my-profile',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTabsModule, Navbar, Footer],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {
  protected auth = inject(AuthService);
  protected reviews = REVIEWS;
  protected sessions = SESSIONS;
}

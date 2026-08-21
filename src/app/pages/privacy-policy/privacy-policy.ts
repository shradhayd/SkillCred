import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink, Navbar, Footer],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy {
  protected auth = inject(AuthService);
  lastUpdated = 'August 21, 2026';
}

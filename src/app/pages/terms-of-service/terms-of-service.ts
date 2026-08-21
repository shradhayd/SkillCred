import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-terms-of-service',
  imports: [RouterLink, MatIconModule, Navbar, Footer],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.css',
})
export class TermsOfService {
  protected auth = inject(AuthService);
  lastUpdated = 'August 21, 2026';
}

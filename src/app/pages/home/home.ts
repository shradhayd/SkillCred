import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { SKILL_CATEGORIES } from '../../shared/mock-data';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected auth = inject(AuthService);
  protected categories = SKILL_CATEGORIES;
  protected searchQuery = '';
}

import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, Navbar, Footer,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  protected error = '';

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    if (this.auth.login(email!, password!)) {
      this.router.navigate(['/home']);
    } else {
      this.error = 'Invalid email or password. Try shradha@gmail.com / shradha1234';
    }
  }
}

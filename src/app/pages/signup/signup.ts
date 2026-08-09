import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule,
    MatInputModule, Navbar, Footer,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  protected error = '';

  protected form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const { name, email, password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    if (this.auth.signup(name!, email!, password!)) {
      this.router.navigate(['/home']);
    } else {
      this.error = 'Could not create account. Please try again.';
    }
  }
}

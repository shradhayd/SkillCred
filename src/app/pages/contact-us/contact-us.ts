import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { apiErrorMessage } from '../../core/booking.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  imports: [
    FormsModule, RouterLink,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    Navbar, Footer,
  ],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs implements OnInit, OnDestroy {
  protected auth = inject(AuthService);
  private api = inject(ApiService);

  /* ── Hero slider ─────────────────────────────────── */
  heroSlides = [
    {
      emoji: '💬',
      logo: '',
      heading: 'Get in Touch',
      sub: "Have a question, issue, or idea? Our team is here to help — usually within 24 hours.",
      bg: 'slide-green',
    },
    {
      emoji: '🛟',
      logo: 'support_agent',
      heading: 'We\'re Here to Help',
      sub: 'From billing to bookings, our support team handles every kind of query with care and speed.',
      bg: 'slide-teal',
    },
    {
      emoji: '🤝',
      logo: '',
      heading: 'Let\'s Work Together',
      sub: 'Interested in partnerships, integrations, or collaborations? We\'d love to hear from you.',
      bg: 'slide-purple',
    },
  ];

  slideIndex = signal(0);
  private slideTimer: ReturnType<typeof setInterval> | null = null;

  get currentSlide() { return this.heroSlides[this.slideIndex()]; }

  /* ── Form fields ─────────────────────────────────── */
  name     = '';
  email    = '';
  subject  = '';
  category = '';
  message  = '';
  submitted  = signal(false);
  ticketRef  = signal('');
  sending    = signal(false);
  sendError  = signal('');

  categories = [
    'General Inquiry',
    'Account & Login',
    'Credits & Billing',
    'Session Issues',
    'Report a User',
    'Technical Bug',
    'Partnership',
    'Other',
  ];

  /* ── FAQ ─────────────────────────────────────────── */
  faqs = [
    { q: 'How do credits work?',               a: 'You earn credits by teaching sessions and spend them to learn. Each teacher sets their own credit rate per session.' },
    { q: "What if a teacher doesn't show up?", a: 'If a teacher misses a confirmed session, your credits are fully refunded within 24 hours. Report the no-show via your session history.' },
    { q: 'Can I get a refund for cancelled sessions?', a: 'Cancellations made 24+ hours before the session receive a full credit refund. Within 24 hours, a partial deduction may apply.' },
    { q: 'How long does support take to respond?', a: 'We typically respond within 24–48 hours on business days. Urgent issues related to safety are handled within a few hours.' },
    { q: 'How do I become a teacher on SkillCred?', a: 'Go to My Profile, add skills you want to teach, set your credit rate, and toggle your availability. Students can then book you directly.' },
  ];

  openFaq: number | null = null;

  /* ── Lifecycle ───────────────────────────────────── */
  ngOnInit(): void {
    this.slideTimer = setInterval(() => this.nextSlide(), 4500);
  }
  ngOnDestroy(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
  }

  /* ── Slider controls ─────────────────────────────── */
  goSlide(i: number): void {
    this.slideIndex.set(i);
    this.resetTimer();
  }
  nextSlide(): void { this.goSlide((this.slideIndex() + 1) % this.heroSlides.length); }
  prevSlide(): void { this.goSlide((this.slideIndex() - 1 + this.heroSlides.length) % this.heroSlides.length); }
  private resetTimer(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
    this.slideTimer = setInterval(() => this.nextSlide(), 4500);
  }

  /* ── FAQ ─────────────────────────────────────────── */
  toggleFaq(i: number): void { this.openFaq = this.openFaq === i ? null : i; }

  /* ── Form ────────────────────────────────────────── */
  async submitForm(): Promise<void> {
    if (!this.name || !this.email || !this.subject || !this.message || this.sending()) return;

    this.sending.set(true);
    this.sendError.set('');
    try {
      const res = await firstValueFrom(
        this.api.post<{ ticketRef: string }>('/contact', {
          name: this.name,
          email: this.email,
          category: this.category,
          subject: this.subject,
          message: this.message,
        })
      );
      this.ticketRef.set(res.ticketRef);
      this.submitted.set(true);
    } catch (err) {
      this.sendError.set(apiErrorMessage(err));
    }
    this.sending.set(false);
  }
  resetForm(): void {
    this.name = this.email = this.subject = this.category = this.message = '';
    this.sendError.set('');
    this.submitted.set(false);
    this.ticketRef.set('');
  }
}

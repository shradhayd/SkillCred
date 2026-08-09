import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatExpansionModule, Navbar, Footer],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorks {
  protected auth = inject(AuthService);

  protected steps = [
    { num: 1, title: 'Create Your Profile', desc: 'Sign up and list the skills you can teach and the skills you want to learn.', icon: 'person_add' },
    { num: 2, title: 'Teach & Earn Credits', desc: 'Share your expertise in live sessions and earn credits for every teaching hour.', icon: 'school' },
    { num: 3, title: 'Learn Using Credits', desc: 'Spend your earned credits to book sessions with teachers across any skill category.', icon: 'auto_stories' },
  ];

  protected features = [
    { icon: '💰', title: 'No Money Involved', desc: 'Everything runs on a credit system. Teach to earn, spend to learn — simple and fair.' },
    { icon: '🤝', title: 'Community Driven', desc: 'Connect with real people who share your passions and learning goals.' },
    { icon: '🎯', title: 'Skill Matching', desc: 'Smart matching helps you find the perfect teacher or student for your needs.' },
  ];

  protected faqs = [
    { q: 'How do I earn credits?', a: 'You earn credits by teaching skills to other users. Each session you teach adds credits to your wallet based on the skill level and duration.' },
    { q: 'Can I learn without teaching?', a: 'New users receive starter credits upon signup. However, the platform encourages a give-and-take model for sustainable learning.' },
    { q: 'What if a session is cancelled?', a: 'If a session is cancelled more than 24 hours in advance, credits are fully refunded. Late cancellations may incur a partial charge.' },
    { q: 'Is there a rating system?', a: 'Yes! After each completed session, both parties can leave reviews and star ratings to maintain quality.' },
  ];
}

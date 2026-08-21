import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  email       = signal('');
  subscribed  = signal(false);
  currentYear = new Date().getFullYear();

  subscribe(): void {
    if (this.email().includes('@')) {
      this.subscribed.set(true);
      setTimeout(() => { this.subscribed.set(false); this.email.set(''); }, 4000);
    }
  }

  stats = [
    { value: '12,000+', label: 'Active Learners'   },
    { value: '850+',    label: 'Skills Available'   },
    { value: '45,000+', label: 'Sessions Completed' },
    { value: '4.8 ★',   label: 'Average Rating'    },
  ];

  columns = [
    {
      title: 'Platform',
      items: [
        { label: 'Home',            route: '/home'           },
        { label: 'Browse Skills',   route: '/browse-skills'  },
        { label: 'How It Works',    route: '/how-it-works'   },
        { label: 'Create Account',  route: '/signup'         },
        { label: 'Sign In',         route: '/login'          },
        { label: 'My Dashboard',    route: '/dashboard'      },
      ],
    },
    {
      title: 'Explore',
      items: [
        { label: 'Coding & Tech',   route: '/browse-skills' },
        { label: 'Design & Art',    route: '/browse-skills' },
        { label: 'Music & Audio',   route: '/browse-skills' },
        { label: 'Languages',       route: '/browse-skills' },
        { label: 'Business',        route: '/browse-skills' },
        { label: 'Photography',     route: '/browse-skills' },
      ],
    },
    {
      title: 'Company',
      items: [
        { label: 'About Us',         route: '/about-us'         },
        { label: 'Contact Us',       route: '/contact-us'       },
        { label: 'Privacy Policy',   route: '/privacy-policy'   },
        { label: 'Terms of Service', route: '/terms-of-service' },
      ],
    },
  ];
}

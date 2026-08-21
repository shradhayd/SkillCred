import { Component, inject, OnInit, OnDestroy, signal, computed, ElementRef, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink, MatButtonModule, MatIconModule, Navbar, Footer],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs implements OnInit, OnDestroy {
  protected auth = inject(AuthService);
  private el   = inject(ElementRef);
  private zone = inject(NgZone);

  /* ── Hero slider ─────────────────────────────────── */
  heroSlides = [
    { badge:'Our Story',  title:"We're on a mission to make learning free for everyone", subtitle:'SkillCred is a peer-to-peer skill exchange platform — teach what you know, learn what you love, without spending a single rupee.', bg:'slide-green',  emoji:'🎓' },
    { badge:'Our Vision', title:'A world where every skill finds its student',            subtitle:'We believe every person has a gift worth sharing. From coding to cooking, music to mathematics — SkillCred connects knowledge with curiosity.', bg:'slide-purple', emoji:'🌍' },
    { badge:'Our Impact', title:'12,000 learners. 45,000 sessions. Zero rupees charged.', subtitle:'In just three years SkillCred has proven that community-powered learning works. The numbers speak — and they keep growing.',   bg:'slide-teal',   emoji:'🚀' },
  ];
  heroIndex     = signal(0);
  heroAnimating = signal(false);
  private heroTimer: ReturnType<typeof setInterval> | null = null;
  currentHero = computed(() => this.heroSlides[this.heroIndex()]);

  /* ── Testimonial slider ──────────────────────────── */
  testimonials = [
    { name:'Rahul K.',  role:'Web Developer',     photo:'https://i.pravatar.cc/80?u=rahul',  quote:'I learned Angular in two weeks by trading Python lessons. SkillCred completely changed how I think about online learning.', stars:5 },
    { name:'Priya S.',  role:'UX Designer',        photo:'https://i.pravatar.cc/80?u=priya',  quote:'Teaching UI design helped me refine my own skills. The feedback loop is incredible — every session makes me better.', stars:5 },
    { name:'Kenji T.',  role:'Language Teacher',   photo:'https://i.pravatar.cc/80?u=kenji',  quote:'I\'ve taught 60+ Japanese sessions and learned React in return. This platform is genius. I tell everyone about it.', stars:5 },
    { name:'Emma D.',   role:'Music Student',      photo:'https://i.pravatar.cc/80?u=emma',   quote:'Found a guitar teacher within minutes, booked a session the same day. Incredibly smooth experience from start to finish.', stars:5 },
    { name:'Carlos R.', role:'Spanish Tutor',      photo:'https://i.pravatar.cc/80?u=carlos', quote:'SkillCred gave me a community of learners I never expected. Teaching feels meaningful when people are genuinely excited to learn.', stars:5 },
  ];
  testiIndex = signal(0);
  private testiTimer: ReturnType<typeof setInterval> | null = null;
  currentTesti = computed(() => this.testimonials[this.testiIndex()]);

  /* ── Static data ─────────────────────────────────── */
  stats = [
    { value:'12,000+', label:'Active Users',      icon:'👥' },
    { value:'850+',    label:'Skills Offered',     icon:'🎯' },
    { value:'45,000+', label:'Sessions Completed', icon:'✅' },
    { value:'98%',     label:'Satisfaction Rate',  icon:'⭐' },
  ];

  values = [
    { icon:'🤝', title:'Community First',    back:'We believe knowledge grows when shared. Our platform is built around human connection, not transactions.',        color:'teal'   },
    { icon:'🌍', title:'Accessible Learning', back:'By using a credit-based system we remove financial barriers and make quality learning accessible to everyone.', color:'purple' },
    { icon:'🔒', title:'Trust & Safety',      back:'We verify teachers, moderate content, and handle disputes fairly to keep SkillCred a safe space for all.',      color:'blue'   },
    { icon:'🚀', title:'Continuous Growth',   back:'We ship new features, listen to feedback, and constantly evolve to better serve our community.',                 color:'coral'  },
    { icon:'⚖️', title:'Fairness',            back:"Our credit system ensures both teachers and learners are valued equally — everyone's time matters.",             color:'amber'  },
    { icon:'🎨', title:'Creative Excellence', back:'We care deeply about design and user experience, building tools that are a joy to use every day.',               color:'pink'   },
  ];

  team = [
    { name:'Shradha Kumar', role:'Co-Founder & CEO',  photo:'https://i.pravatar.cc/150?u=shradha', bio:'Former educator turned technologist. Shradha founded SkillCred to democratise skill exchange globally.' },
    { name:'Rahul Mehta',   role:'Co-Founder & CTO',  photo:'https://i.pravatar.cc/150?u=rahul_m', bio:'Full-stack engineer with a passion for scalable platforms. Rahul leads all engineering at SkillCred.' },
    { name:'Priya Sharma',  role:'Head of Product',   photo:'https://i.pravatar.cc/150?u=priya_s', bio:'Product designer who obsesses over user delight. Priya shapes every feature on the platform.' },
    { name:'Amit Patel',    role:'Head of Community', photo:'https://i.pravatar.cc/150?u=amit_p',  bio:'Community builder and educator. Amit ensures every user feels supported and part of the family.' },
  ];

  milestones = [
    { year:'2023 Q1', title:'Founded',       desc:'SkillCred was born in a Mumbai co-working space with 5 founding members and a big vision.' },
    { year:'2023 Q3', title:'Beta Launch',   desc:'Launched a private beta with 200 early users — the feedback was phenomenal.' },
    { year:'2024 Q1', title:'5,000 Users',   desc:'Crossed 5,000 registered users and 10,000 completed sessions within the first year.' },
    { year:'2025 Q2', title:'Seed Funding',  desc:'Raised $2.5M seed funding to expand the team and launch mobile apps.' },
    { year:'2026 Q3', title:'12,000+ Users', desc:'Today SkillCred serves learners and teachers across 40+ countries worldwide.' },
  ];

  /* ── Lifecycle ───────────────────────────────────── */
  ngOnInit(): void {
    this.heroTimer  = setInterval(() => this.nextHero(),  5000);
    this.testiTimer = setInterval(() => this.nextTesti(), 4000);
    this.zone.runOutsideAngular(() => this._initTilt());
  }

  ngOnDestroy(): void {
    if (this.heroTimer)  clearInterval(this.heroTimer);
    if (this.testiTimer) clearInterval(this.testiTimer);
  }

  /* ── Hero controls ───────────────────────────────── */
  goHero(i: number): void {
    if (this.heroAnimating()) return;
    this.heroAnimating.set(true);
    this.heroIndex.set(i);
    setTimeout(() => this.heroAnimating.set(false), 600);
    this._resetHeroTimer();
  }
  nextHero(): void { this.goHero((this.heroIndex()+1) % this.heroSlides.length); }
  prevHero(): void { this.goHero((this.heroIndex()-1+this.heroSlides.length) % this.heroSlides.length); }
  private _resetHeroTimer(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.heroTimer = setInterval(() => this.nextHero(), 5000);
  }

  /* ── Testimonial controls ────────────────────────── */
  goTesti(i: number): void { this.testiIndex.set(i); this._resetTestiTimer(); }
  nextTesti(): void { this.goTesti((this.testiIndex()+1) % this.testimonials.length); }
  prevTesti(): void { this.goTesti((this.testiIndex()-1+this.testimonials.length) % this.testimonials.length); }
  private _resetTestiTimer(): void {
    if (this.testiTimer) clearInterval(this.testiTimer);
    this.testiTimer = setInterval(() => this.nextTesti(), 4000);
  }

  /* ── 3D Mouse-tilt for .tilt-3d elements ────────── */
  private _initTilt(): void {
    const handler = (e: MouseEvent) => {
      const cards = (this.el.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.tilt-3d');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        // Only tilt if mouse is relatively close
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 1.8) {
          card.style.setProperty('--rx',  String( dx * 12));
          card.style.setProperty('--ry',  String(-dy * 12));
          card.style.setProperty('--mx',  String(((e.clientX - rect.left) / rect.width)  * 100));
          card.style.setProperty('--my',  String(((e.clientY - rect.top)  / rect.height) * 100));
        } else {
          card.style.setProperty('--rx', '0');
          card.style.setProperty('--ry', '0');
        }
      });
    };
    const reset = () => {
      (this.el.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.tilt-3d')
        .forEach(c => { c.style.setProperty('--rx','0'); c.style.setProperty('--ry','0'); });
    };
    document.addEventListener('mousemove', handler);
    document.addEventListener('mouseleave', reset);
    // Store refs for cleanup — minimal approach
    (this as any)._tiltHandler  = handler;
    (this as any)._tiltReset    = reset;
  }
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

/* ================================================================
   SCROLL-REVEAL  (IntersectionObserver → adds .in-view)
================================================================ */
const REVEAL_SEL = [
  '.reveal-up','.reveal-left','.reveal-right','.reveal-scale',
  '.reveal-flip-x','.reveal-flip-y','.reveal-zoom3d','.reveal-fade'
].join(',');

function initReveal(): void {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll<HTMLElement>(REVEAL_SEL).forEach((el) => io.observe(el));

  // Re-scan when Angular lazy-loads new page components
  new MutationObserver(() => {
    document.querySelectorAll<HTMLElement>(`${REVEAL_SEL}:not(.in-view)`)
      .forEach((el) => io.observe(el));
  }).observe(document.body, { childList: true, subtree: true });
}

/* ================================================================
   3D MOUSE TILT  (updates CSS vars --rx --ry --mx --my on .tilt-card)
================================================================ */
function initTilt(): void {
  document.addEventListener('mousemove', (e: MouseEvent) => {
    document.querySelectorAll<HTMLElement>('.tilt-card').forEach((card) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        card.style.setProperty('--rx',  String( dx * 14));
        card.style.setProperty('--ry',  String(-dy * 14));
        card.style.setProperty('--mx', String(((e.clientX - r.left) / r.width)  * 100));
        card.style.setProperty('--my', String(((e.clientY - r.top)  / r.height) * 100));
      } else {
        card.style.setProperty('--rx', '0'); card.style.setProperty('--ry', '0');
      }
    });
  });

  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    document.querySelectorAll<HTMLElement>('.tilt-card').forEach((c) => {
      c.style.setProperty('--rx', '0'); c.style.setProperty('--ry', '0');
    });
  });
}

/* ================================================================
   3D PARALLAX LAYERS on hero sections (mouse moves bg layers)
================================================================ */
function initParallax(): void {
  document.addEventListener('mousemove', (e: MouseEvent) => {
    const heroes = document.querySelectorAll<HTMLElement>('.parallax-hero');
    heroes.forEach((hero) => {
      const r   = hero.getBoundingClientRect();
      const rx  = ((e.clientX - r.left) / r.width  - 0.5) * 30;
      const ry  = ((e.clientY - r.top)  / r.height - 0.5) * 30;
      hero.style.setProperty('--px', String(rx));
      hero.style.setProperty('--py', String(ry));
    });
  });
}

if (typeof window !== 'undefined') {
  const run = () => { initReveal(); initTilt(); initParallax(); };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}

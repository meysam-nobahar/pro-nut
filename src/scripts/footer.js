// Footer: phones fold the link columns into rows that open; "Back to top" scrolls up; the card's content rises in once.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const footer = document.querySelector('.site-footer');

footer?.querySelectorAll('[data-fgroup]').forEach((group) => {
  const button = group.querySelector('.site-footer__toggle');
  button?.addEventListener('click', () => button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true')));
});

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
footer?.querySelector('[data-to-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' }));

if (footer && !still) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: footer, start: 'top 85%', once: true } })
    .from(footer.querySelector('.site-footer__logo'), { autoAlpha: 0, rotate: -120, scale: 0.7, duration: 1.1 }, 0)
    .from(footer.querySelectorAll('.site-footer__lead > :not(.site-footer__id), .site-footer__group'), { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.08 }, 0.15)
    .from(footer.querySelector('.site-footer__bottom'), { autoAlpha: 0, y: 12, duration: 0.7 }, 0.6);
}

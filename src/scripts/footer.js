// Footer intro: the logo turns in, the tagline and wordmark rise out of masks, the rest follows.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const footer = document.querySelector('.site-footer');

/* Phones: the footer menus open and close. Desktop shows them all, so the buttons are hidden there. */
footer?.querySelectorAll('[data-fgroup]').forEach((group) => {
  const button = group.querySelector('.site-footer__toggle');
  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
  });
});

if (footer && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const logo = footer.querySelector('.site-footer__logo');
  const tagline = footer.querySelector('.site-footer__top h2');
  const links = footer.querySelectorAll('.site-footer__nav a');
  const wordmark = footer.querySelector('.site-footer__wordmark');
  const legal = footer.querySelector('.site-footer__legal');

  const tagSplit = SplitText.create(tagline, { type: 'lines', mask: 'lines' });
  const wordSplit = SplitText.create(wordmark, { type: 'chars' });

  const intro = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: { trigger: footer, start: 'top 82%', toggleActions: 'play none restart reset' },
  });
  intro
    .from(logo, { autoAlpha: 0, scale: 0.55, rotate: -140, duration: 1.3, ease: 'power3.out' }, 0)
    .from(tagSplit.lines, { yPercent: 115, duration: 1.5, stagger: 0.14 }, 0.2)
    .from(links, { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.04, ease: 'power3.out' }, 0.35)
    .from(wordSplit.chars, { yPercent: 115, duration: 1.5, stagger: 0.045 }, 0.5)
    .from(legal, { autoAlpha: 0, y: 14, duration: 0.8, ease: 'power3.out' }, 1);
}

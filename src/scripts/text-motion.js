// Text motion for every page: headings rise out of masks letter by letter, paragraphs arrive line by line out of a blur.
// Elements that other scripts already animate (cards, reveal blocks, the hero title) are skipped.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const root = document.documentElement;
const SKIP = '.card, .h-card, .h-item, .h-promo, table, form, .mega, .h-mq, details, .filters, .crumbs, .seg, .tag, .btn, a, button, label, [data-reveal], [data-hero-in], [data-hero-title], [data-card], [data-no-split]';

const lift = () => {
  window.__textReady = true;
  root.classList.remove('tm');
};

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  lift();
} else {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const start = () => {
    try {
      const targets = [...document.querySelectorAll('main h1, main h2, main h3, main p')].filter(
        (el) => !el.closest(SKIP) && el.textContent.trim() && !el.hidden && el.getClientRects().length > 0,
      );

      targets.forEach((el) => {
        const inHero = Boolean(el.closest('.hero, .h-hero'));
        /* enter: play; scrolled past: leave it alone; back in view from above: play again; back above the start line: reset */
        const trigger = { trigger: el, start: 'top 90%', toggleActions: 'play none restart reset' };
        const delay = inHero ? 0.5 : 0;
        const level = el.tagName;

        if (level === 'H1' || level === 'H2') {
          /* Main titles: every letter climbs out of its line's mask with a slight tilt */
          SplitText.create(el, {
            type: 'lines,chars',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 120,
                rotate: 6,
                transformOrigin: '0% 100%',
                duration: 1.5,
                ease: 'power3.out',
                stagger: { each: 0.03, from: 'start' },
                delay,
                scrollTrigger: trigger,
              }),
          });
        } else if (level === 'H3') {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.3, ease: 'power3.out', stagger: 0.1, delay, scrollTrigger: trigger }),
          });
        } else {
          /* Text: lines drift up out of a blur and settle */
          SplitText.create(el, {
            type: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                autoAlpha: 0,
                y: 28,
                skewY: 3,
                filter: 'blur(10px)',
                transformOrigin: '0% 0%',
                duration: 1.6,
                ease: 'power2.out',
                stagger: Math.min(0.1, 0.7 / Math.max(self.lines.length, 1)),
                delay: delay + 0.05,
                scrollTrigger: trigger,
              }),
          });
        }
      });
    } finally {
      lift();
      ScrollTrigger.refresh();
    }
  };

  /* Lines are measured, so wait for the fonts */
  (document.fonts?.ready ?? Promise.resolve()).then(start);
}

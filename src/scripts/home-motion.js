// Home page motion. Decoration only: with JavaScript off or "reduce motion" on,
// the page shows all of its content in its final state.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The two videos play only while visible (and not at all with reduced motion); a tap switches them on touch screens */
document.querySelectorAll('[data-visual]').forEach((visual) => {
  const videos = [...visual.querySelectorAll('video')];
  if (reduceMotion) {
    /* still frames instead of empty boxes */
    videos.forEach((video) => {
      video.preload = 'auto';
      const still = () => { try { video.currentTime = 1.2; } catch (error) {} };
      if (video.readyState >= 2) still(); else video.addEventListener('loadeddata', still, { once: true });
    });
    return;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => videos.forEach((video) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause())));
    }, { threshold: 0.2 }).observe(visual);
  } else {
    videos.forEach((video) => video.play().catch(() => {}));
  }
});
document.querySelectorAll('[data-visual]').forEach((visual) => {
  visual.addEventListener('click', () => {
    if (matchMedia('(hover: none)').matches) visual.classList.toggle('is-alt');
  });
});

/* Motion switch: stores the choice and reloads, so every script starts in the same mode */
const motionButton = document.querySelector('[data-motion-toggle]');
if (motionButton && root.dataset.motionSystem !== 'reduce') {
  const off = root.classList.contains('motion-off');
  motionButton.hidden = false;
  motionButton.setAttribute('aria-pressed', String(off));
  motionButton.querySelector('.h-motion-text').textContent = off ? 'Motion off' : 'Reduce motion';
  motionButton.addEventListener('click', () => {
    try { localStorage.setItem('rn-motion', off ? 'on' : 'off'); } catch (error) {}
    location.reload();
  });
}

/* Hero video: loops from the first frame to the end, paused with reduced motion and while the hero is off screen */
const heroVideo = document.querySelector('.h-hero-video');
if (heroVideo) {
  heroVideo.loop = true;
  if (reduceMotion) {
    /* a still frame of the film instead of an empty or old picture */
    const still = () => { try { heroVideo.currentTime = 7; } catch (error) {} heroVideo.pause(); };
    if (heroVideo.readyState >= 2) still(); else heroVideo.addEventListener('loadeddata', still, { once: true });
  }
  else if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause()));
    }).observe(document.querySelector('[data-hero]'));
  }
}

const media = gsap.matchMedia();

media.add('(prefers-reduced-motion: no-preference)', () => {
  /* Start states are set here, then the CSS gate is lifted, so GSAP owns visibility from now on. */
  gsap.set('[data-reveal]', { autoAlpha: 0, y: 28 });
  /* Second section: the pill, headline, text and tiles blur in one after another, once */
  gsap.set('[data-intro]', { autoAlpha: 0, y: -20, filter: 'blur(10px)' });
  gsap.set('[data-hero-in]', { autoAlpha: 0, y: 20 });
  root.classList.remove('motion');
  window.__motionReady = true;

  /* Headline: word by word, each rising out of its own line */
  SplitText.create('[data-hero-title]', {
    type: 'lines,words',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) => gsap.from(self.words, { yPercent: 125, duration: 1.5, ease: 'power4.out', stagger: 0.16, delay: 0.35 }),
  });
  gsap.to('[data-hero-in]', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1, delay: 1.15 });
  gsap.from('.h-hero-photo', { scale: 1.08, duration: 1.8, ease: 'power3.out' });

  /* Second section: plays once, when the visitor reaches it. Each item blurs in from above, 0.4 s after the one before. */
  const introItems = gsap.utils.toArray('[data-intro]');
  /* on phones the tiles are one stacked deck, so they deal in quickly together instead of one every 0.4 s */
  const deckStart = matchMedia('(max-width: 700px)').matches ? introItems.findIndex((el) => el.parentElement.classList.contains('h-intro-grid')) : -1;
  const delayOf = (i) => (deckStart >= 0 && i >= deckStart ? (deckStart + 1) * 0.4 + (i - deckStart) * 0.09 : (i + 1) * 0.4);
  if (introItems.length) {
    ScrollTrigger.create({
      trigger: '.h-intro',
      start: 'top 55%',
      once: true,
      onEnter: () => introItems.forEach((el, i) => gsap.to(el, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, delay: delayOf(i), ease: 'power2.out', overwrite: true, clearProps: 'filter' })),
    });
  }

  /* One trigger per block: it plays once, the first time the block is reached */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const delay = Math.min(Array.prototype.indexOf.call(el.parentElement?.children ?? [], el), 5) * 0.06;
    const show = () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out', delay, overwrite: true });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: show });
  });

  addEventListener('load', () => ScrollTrigger.refresh());

  /* Hero film: the picture shrinks into a frame while the headline leaves and three figures arrive */
  const hero = document.querySelector('[data-hero]');
  const stage = hero?.querySelector('[data-stage]');
  if (stage) {
    const header = document.querySelector('[data-header]');
    hero.classList.add('is-film');
    if (header) header.dataset.themeLock = '1';
    const mediaBox = stage.querySelector('[data-media]');
    const picture = mediaBox.querySelector('video') ?? mediaBox.querySelector('img');
    const framed = () => {
      const style = getComputedStyle(hero);
      const side = innerWidth < 760 ? 16 : Math.round(innerWidth * 0.12);
      return `inset(${parseFloat(style.getPropertyValue('--f-top'))}px ${side}px ${parseFloat(style.getPropertyValue('--f-bottom'))}px ${side}px round ${parseFloat(style.getPropertyValue('--f-radius'))}px)`;
    };
    /* The caption under the logo writes itself in, letter by letter, once the logo has landed */
    let captionShown = false;
    let captionIn = null;
    const captionEl = stage.querySelector('.h-hero-caption');
    if (captionEl) {
      const split = SplitText.create(captionEl, { type: 'chars,words', mask: 'chars' });
      const spacing = innerWidth < 560 ? '0.12em' : '0.2em';
      captionIn = gsap.timeline({ paused: true })
        .fromTo('.h-hero-rule', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.out' }, 0)
        .fromTo(captionEl, { letterSpacing: innerWidth < 560 ? '0.4em' : '0.8em' }, { letterSpacing: spacing, duration: 1.6, ease: 'power3.out' }, 0)
        .fromTo(split.chars, { yPercent: 130, opacity: 0, filter: 'blur(10px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out', stagger: 0.05 }, 0.1);
    }
    /* The animation fills the first part of the pinned scroll; the rest holds the finished frame before the page moves on. */
    const HOLD_TOTAL = 1.7;
    const film = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => '+=' + Math.round(innerHeight * 0.9 * HOLD_TOTAL),
        pin: stage,
        scrub: 1.1,
        refreshPriority: 1, /* the pin adds scroll distance, so it must be measured before the triggers below it */
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (header) header.dataset.theme = self.progress * HOLD_TOTAL < 0.5 ? 'dark' : 'light';
          const show = self.progress * HOLD_TOTAL > 0.62;
          if (captionIn && show !== captionShown) {
            captionShown = show;
            if (show) captionIn.timeScale(1).play(); else captionIn.timeScale(2).reverse();
          }
        },
      },
    });
    film
      .fromTo(mediaBox, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: framed, duration: 1 }, 0)
      .fromTo(picture, { scale: 1.18 }, { scale: 1, duration: 1 }, 0)
      .to('[data-hero-inner]', { y: -80, autoAlpha: 0, duration: 0.45 }, 0)
      .to('.h-motion', { autoAlpha: 0, duration: 0.3 }, 0)
      .fromTo(stage, { backgroundColor: 'rgba(10, 10, 10, 1)' }, { backgroundColor: 'rgba(10, 10, 10, 0)', duration: 0.4 }, 0.3)
      .fromTo('.h-hero-badge', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.5)
      .fromTo('.h-hero-badge img', { scale: 0.4, rotate: -140 }, { scale: 1, rotate: 0, duration: 0.35, ease: 'power2.out' }, 0.5)
      .fromTo('.h-hero-ring', { scale: 0.45, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.8, duration: 0.35, ease: 'power2.out' }, 0.55)
      .fromTo('.h-mq', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
      .to({}, { duration: HOLD_TOTAL - 1 }, 1);

    return () => {
      hero.classList.remove('is-film');
      if (header) delete header.dataset.themeLock;
    };
  }

});

/* With reduced motion nothing was ever hidden, so there is nothing to undo. */
window.__motionReady = true;

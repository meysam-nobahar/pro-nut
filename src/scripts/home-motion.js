// Home page motion. Decoration only: with JavaScript off or "reduce motion" on,
// the page shows all of its content in its final state.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The sample chart fills the first time it is seen */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('pre');
      seen.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-chart]').forEach((chart) => {
    chart.classList.add('pre');
    seen.observe(chart);
  });
}

/* The two videos play only while visible (and not at all with reduced motion); a tap switches them on touch screens */
document.querySelectorAll('[data-visual]').forEach((visual) => {
  const videos = [...visual.querySelectorAll('video')];
  if (reduceMotion) return;
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

/* Hero video: it plays only the clean stretch of the film (no title cards or black dips), paused with reduced motion and while the hero is off screen */
const heroVideo = document.querySelector('.h-hero-video');
if (heroVideo) {
  const LOOP_START = 9.3;
  const LOOP_END = 18.2;
  const begin = () => { if (heroVideo.duration > LOOP_END) heroVideo.currentTime = LOOP_START; };
  if (heroVideo.readyState >= 1) begin(); else heroVideo.addEventListener('loadedmetadata', begin, { once: true });
  heroVideo.removeAttribute('loop');
  let watching = 0;
  const watch = () => {
    if (heroVideo.duration > LOOP_END && (heroVideo.currentTime >= LOOP_END || heroVideo.ended)) {
      heroVideo.currentTime = LOOP_START;
      heroVideo.play().catch(() => {});
    }
    watching = heroVideo.paused ? 0 : requestAnimationFrame(watch);
  };
  heroVideo.addEventListener('play', () => { if (!watching) watching = requestAnimationFrame(watch); });
  heroVideo.addEventListener('ended', () => { heroVideo.currentTime = LOOP_START; heroVideo.play().catch(() => {}); });
  if (reduceMotion) heroVideo.pause();
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
  gsap.set('[data-card]', { autoAlpha: 0 });
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

  /* One trigger per block: it plays once, the first time the block is reached */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const delay = Math.min(Array.prototype.indexOf.call(el.parentElement?.children ?? [], el), 5) * 0.06;
    const show = () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out', delay, overwrite: true });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: show });
  });

  /* Ranges: each card is drawn open from the top, then its parts follow; it plays once */
  const cardTimelines = new Map();
  const cardTimeline = (card, index) => {
    if (cardTimelines.has(card)) return cardTimelines.get(card);
    const part = (selector) => card.querySelectorAll(selector);
    const tl = gsap.timeline({ paused: true, delay: index * 0.12 });
    tl.set(card, { autoAlpha: 1 }, 0)
      .fromTo(card, { clipPath: 'inset(0 0 100% 0 round 4px)', y: -72, rotationX: -16, transformPerspective: 900, transformOrigin: '50% 0%' }, { clipPath: 'inset(0 0 0% 0 round 4px)', y: 0, rotationX: 0, duration: 1.7, ease: 'power3.out' }, 0)
      .from(part('.h-card-strip img'), { scale: 1.4, duration: 1.6, ease: 'power3.out' }, 0)
      .from(part('.h-card-strip span'), { autoAlpha: 0, y: 24, duration: 0.8, ease: 'power3.out' }, 0.35)
      .from(part('.h-card-body li'), { autoAlpha: 0, x: -18, duration: 0.6, ease: 'power3.out', stagger: 0.07 }, 0.4)
      .from(part('.h-card-all'), { autoAlpha: 0, y: 10, duration: 0.5, ease: 'power3.out' }, 0.85)
      .from(part('.h-card-pack img'), { autoAlpha: 0, y: 56, rotate: -6, duration: 1, ease: 'power3.out' }, 0.5)
      .from(part('.h-card-count'), { autoAlpha: 0, scale: 0.7, duration: 1, ease: 'power3.out' }, 0.5);
    cardTimelines.set(card, tl);
    return tl;
  };
  gsap.utils.toArray('[data-card]').forEach((card, i) => {
    const column = i % 2;
    const play = () => cardTimeline(card, column).restart();
    ScrollTrigger.create({ trigger: card, start: 'top 90%', once: true, onEnter: play });
  });
  gsap.utils.toArray('.h-card-strip img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.closest('.h-card'), start: 'top bottom', end: 'bottom top', scrub: true } });
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
    const film = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => '+=' + Math.round(innerHeight * 0.9),
        pin: stage,
        scrub: 1.1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (header) header.dataset.theme = self.progress < 0.5 ? 'dark' : 'light';
          const show = self.progress > 0.62;
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
      .to(stage, { backgroundColor: '#f2f2f0', duration: 0.4 }, 0.3)
      .fromTo('.h-hero-badge', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.5)
      .fromTo('.h-hero-badge img', { scale: 0.4, rotate: -140 }, { scale: 1, rotate: 0, duration: 0.35, ease: 'power2.out' }, 0.5)
      .fromTo('.h-hero-ring', { scale: 0.45, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.8, duration: 0.35, ease: 'power2.out' }, 0.55)
      .fromTo('.h-mq', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7);

    return () => {
      hero.classList.remove('is-film');
      if (header) delete header.dataset.themeLock;
    };
  }

});

/* With reduced motion nothing was ever hidden, so there is nothing to undo. */
window.__motionReady = true;

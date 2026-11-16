// Home page motion. Everything here is decoration: with JavaScript off, or with
// "reduce motion" on, the page shows all of its content in its final state.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Range list: a card follows the pointer and steps through the range's products as it moves left and right ---- */
const previewCard = document.querySelector('[data-preview-card]');
if (previewCard && finePointer) {
  const image = previewCard.querySelector('img');
  const nameLabel = previewCard.querySelector('[data-preview-name]');
  const dotsHost = previewCard.querySelector('[data-preview-dots]');
  const cardWidth = 208;
  const moveX = gsap.quickTo(previewCard, 'x', { duration: reduceMotion ? 0 : 0.5, ease: 'power3.out' });
  const moveY = gsap.quickTo(previewCard, 'y', { duration: reduceMotion ? 0 : 0.5, ease: 'power3.out' });
  let items = [];
  let current = -1;

  const position = (event) => {
    const flipped = event.clientX + 32 + cardWidth > innerWidth - 12;
    return { x: flipped ? event.clientX - 32 - cardWidth : event.clientX + 32, y: Math.max(12, event.clientY - 110) };
  };
  const show = (index) => {
    if (index === current || !items[index]) return;
    const direction = index > current ? 1 : -1;
    const first = current === -1;
    current = index;
    image.src = items[index].src;
    nameLabel.textContent = items[index].name;
    dotsHost.querySelectorAll('i').forEach((dot, i) => dot.classList.toggle('is-on', i === index));
    if (!first && !reduceMotion) gsap.fromTo(image, { x: direction * 26, scale: 1.08, opacity: 0.35 }, { x: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out', overwrite: true });
  };

  document.querySelectorAll('[data-previews]').forEach((row) => {
    const list = JSON.parse(row.dataset.previews);
    const indexAt = (event) => {
      const box = row.getBoundingClientRect();
      return Math.min(list.length - 1, Math.max(0, Math.floor(((event.clientX - box.left) / box.width) * list.length)));
    };
    row.addEventListener('pointerenter', (event) => {
      items = list;
      current = -1;
      list.forEach((item) => { new Image().src = item.src; });
      dotsHost.replaceChildren(...list.map(() => document.createElement('i')));
      show(indexAt(event));
      const at = position(event);
      gsap.set(previewCard, { x: at.x, y: at.y });
      gsap.to(previewCard, { autoAlpha: 1, scale: 1, rotate: 3, duration: reduceMotion ? 0 : 0.35, ease: 'power3.out', overwrite: 'auto' });
    });
    row.addEventListener('pointermove', (event) => {
      const at = position(event);
      moveX(at.x);
      moveY(at.y);
      show(indexAt(event));
    });
    row.addEventListener('pointerleave', () => gsap.to(previewCard, { autoAlpha: 0, scale: 0.9, rotate: 0, duration: reduceMotion ? 0 : 0.25, overwrite: 'auto' }));
  });
  gsap.set(previewCard, { scale: 0.9 });
}

const media = gsap.matchMedia();

media.add('(prefers-reduced-motion: no-preference)', () => {
  const hero = document.querySelector('[data-hero]');

  /* Start states are set here, then the CSS gate is lifted, so GSAP owns visibility from now on. */
  gsap.set('[data-reveal]', { autoAlpha: 0, y: 36 });
  gsap.set('[data-hero-in]', { autoAlpha: 0, y: 22 });
  root.classList.remove('motion');
  window.__motionReady = true;

  /* ---- Headlines: lines rise out of a mask ---- */
  const splitLines = (element, vars) =>
    SplitText.create(element, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'h-line',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, { yPercent: 112, duration: 1.1, ease: 'power4.out', stagger: 0.11, ...vars }),
    });

  /* ---- Hero entrance ---- */
  splitLines('[data-hero-title]', { delay: 0.15 });
  gsap.to('[data-hero-in]', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.45 });

  /* ---- Hero on scroll: the copy leaves first, the stage lingers ---- */
  if (hero) {
    const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('[data-hero-copy]', { y: -70, opacity: 0.15, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-hero-bg]', { yPercent: 7, ease: 'none', scrollTrigger: scrub });
  }

  /* ---- Section headlines ---- */
  gsap.utils.toArray('[data-split]').forEach((element) => {
    splitLines(element, { scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
  });

  /* ---- Everything else rises in as it enters, neighbours staggered ---- */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (elements) => gsap.to(elements, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09, overwrite: true }),
  });

  /* ---- Numbers count up ---- */
  gsap.utils.toArray('[data-count]').forEach((element) => {
    const end = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    const state = { value: 0 };
    element.textContent = (0).toFixed(decimals);
    gsap.to(state, {
      value: end,
      duration: 1.6,
      ease: 'power2.out',
      delay: element.closest('[data-hero]') ? 0.9 : 0,
      scrollTrigger: { trigger: element, start: 'top 94%', once: true },
      onUpdate: () => { element.textContent = state.value.toFixed(decimals); },
    });
  });

  /* ---- Approach: the line beside the three steps fills as you read down ---- */
  if (document.querySelector('[data-steps]')) {
    gsap.from('[data-steps-progress]', { scaleY: 0, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 72%', end: 'bottom 60%', scrub: 0.6 } });
  }

  /* ---- Label bars fill from the left ---- */
  gsap.from('[data-bar]', { scaleX: 0, duration: 1.3, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '[data-bar]', start: 'top 88%', once: true } });

  /* ---- Parallax: tile photos and the label pack drift against the scroll ---- */
  gsap.utils.toArray('[data-speed]').forEach((element) => {
    const amount = Number(element.dataset.speed) * 6;
    gsap.fromTo(element, { yPercent: -amount }, { yPercent: amount, ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---- Marquee picks up speed with the scroll, then settles ---- */
  const tracks = document.querySelectorAll('.h-marquee-track');
  const rate = { value: 1 };
  const applyRate = () => tracks.forEach((track) => track.getAnimations().forEach((animation) => { animation.playbackRate = rate.value; }));
  ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = Math.min(Math.abs(self.getVelocity()) / 350, 5);
      gsap.to(rate, { value: 1 + boost, duration: 0.2, overwrite: true, onUpdate: applyRate, onComplete: () => gsap.to(rate, { value: 1, duration: 1.2, ease: 'power2.out', onUpdate: applyRate }) });
    },
  });

  addEventListener('load', () => ScrollTrigger.refresh());
});

/* With reduced motion nothing was ever hidden, so there is nothing to undo. */
window.__motionReady = true;

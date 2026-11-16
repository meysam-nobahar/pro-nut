// Product page behaviour and motion. The page is complete without it: with JavaScript off
// or "reduce motion" on, every value, bar and section shows in its final state.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---- Pack picture: flavour chips and pack views swap it with a short fade ---- */
const main = document.querySelector('[data-main]');
const flavourName = document.querySelector('[data-flavour-name]');
const imageButtons = document.querySelectorAll('button[data-img]');
imageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    imageButtons.forEach((b) => b.setAttribute('aria-pressed', b === button ? 'true' : 'false'));
    if (flavourName && button.dataset.label) flavourName.textContent = button.dataset.label;
    const next = new Image();
    next.src = button.dataset.img;
    main.classList.add('is-swapping');
    const show = () => {
      main.src = button.dataset.img;
      main.alt = button.dataset.alt;
      main.classList.remove('is-swapping');
    };
    const wait = new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : 200));
    Promise.all([wait, next.decode().catch(() => {})]).then(show);
  });
});

/* ---- Nutrition label: the amount switch re-reads every row for the chosen column ---- */
const tweenNumber = (element, text) => {
  const from = element.textContent.match(/^([\d.]+)(.*)$/);
  const to = text.match(/^([\d.]+)(.*)$/);
  if (reduceMotion || !from || !to || from[2] !== to[2]) { element.textContent = text; return; }
  const decimals = (to[1].split('.')[1] ?? '').length;
  const state = { value: Number(from[1]) };
  gsap.to(state, {
    value: Number(to[1]),
    duration: 0.6,
    ease: 'power3.out',
    overwrite: true,
    onUpdate: () => { element.textContent = state.value.toFixed(decimals) + to[2]; },
    onComplete: () => { element.textContent = text; },
  });
};

document.querySelectorAll('[data-sheet]').forEach((sheet) => {
  const buttons = sheet.querySelectorAll('[data-col]');
  const table = sheet.querySelector('[data-bars-root]');
  const columnName = sheet.querySelector('[data-col-name]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const column = Number(button.dataset.col);
      buttons.forEach((b) => b.setAttribute('aria-pressed', b === button ? 'true' : 'false'));
      if (columnName) columnName.textContent = button.textContent;
      table?.classList.add('live');
      sheet.querySelectorAll('[data-row]').forEach((row) => {
        const mains = JSON.parse(row.dataset.main);
        const notes = JSON.parse(row.dataset.note);
        const bars = JSON.parse(row.dataset.bars);
        tweenNumber(row.querySelector('[data-val]'), mains[column] ?? '');
        row.querySelector('[data-note]').textContent = notes[column] ?? '';
        const bar = row.querySelector('[data-bar]');
        if (bar) {
          const next = bars[column];
          bar.style.setProperty('--w', next ? next[0] : 0);
          bar.classList.toggle('nrv', Boolean(next && next[1]));
          bar.parentElement.classList.toggle('empty', !next);
        }
      });
    });
  });
});

/* ---- Long tables start short; the button opens the rest ---- */
document.querySelectorAll('[data-more]').forEach((button) => {
  button.addEventListener('click', () => {
    const open = button.closest('[data-sheet]').classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
    ScrollTrigger.refresh();
  });
});

/* ---- Bars grow from zero the first time their table is seen ---- */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('pre');
      seen.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-bars-root]').forEach((table) => {
    table.classList.add('pre');
    seen.observe(table);
  });
}

/* ---- Section tabs follow the section being read ---- */
const tabLinks = document.querySelectorAll('[data-tab]');
if (tabLinks.length && 'IntersectionObserver' in window) {
  const setCurrent = (id) => tabLinks.forEach((link) => {
    const on = link.dataset.tab === id;
    if (on) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(entry.target.dataset.section); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('[data-section]').forEach((section) => spy.observe(section));
}

const media = gsap.matchMedia();

media.add('(prefers-reduced-motion: no-preference)', () => {
  /* Start states are set here, then the CSS gate is lifted, so GSAP owns visibility from now on. */
  gsap.set('[data-reveal]', { autoAlpha: 0, y: 28 });
  gsap.set('[data-hero-in]', { autoAlpha: 0, y: 20 });
  root.classList.remove('motion');
  window.__motionReady = true;

  /* Hero: the name rises out of a mask, the rest follows */
  SplitText.create('[data-hero-title]', {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.1, delay: 0.1 }),
  });
  gsap.to('[data-hero-in]', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.25 });
  if (main) gsap.from(main, { scale: 0.9, y: 24, duration: 1.2, ease: 'power3.out', delay: 0.3 });

  /* The pack leans a few pixels toward the pointer */
  const stage = document.querySelector('[data-stage]');
  if (stage && main && finePointer) {
    const moveX = gsap.quickTo(main, 'x', { duration: 0.8, ease: 'power3.out' });
    const moveY = gsap.quickTo(main, 'y', { duration: 0.8, ease: 'power3.out' });
    const turn = gsap.quickTo(main, 'rotation', { duration: 0.8, ease: 'power3.out' });
    stage.addEventListener('pointermove', (event) => {
      const box = stage.getBoundingClientRect();
      const dx = (event.clientX - box.left) / box.width - 0.5;
      const dy = (event.clientY - box.top) / box.height - 0.5;
      moveX(dx * 16);
      moveY(dy * 12);
      turn(dx * 2.5);
    });
    stage.addEventListener('pointerleave', () => { moveX(0); moveY(0); turn(0); });
  }

  /* Everything else rises in as it enters, neighbours staggered */
  /* One trigger per block: it plays once, the first time the block is reached */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const delay = Math.min(Array.prototype.indexOf.call(el.parentElement?.children ?? [], el), 5) * 0.06;
    const show = () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out', delay, overwrite: true });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: show });
  });

  /* Key figures count up */
  gsap.utils.toArray('[data-count]').forEach((element) => {
    const end = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    const state = { value: 0 };
    element.textContent = (0).toFixed(decimals);
    gsap.to(state, {
      value: end,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 96%', once: true },
      onUpdate: () => { element.textContent = state.value.toFixed(decimals); },
    });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
});

/* With reduced motion nothing was ever hidden, so there is nothing to undo. */
window.__motionReady = true;

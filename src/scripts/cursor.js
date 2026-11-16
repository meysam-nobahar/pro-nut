// Custom cursor: a small diamond (the pack motif) with a trailing ring.
// On links the ring grows; on pictures it turns into a labelled disc. Touch devices and reduced motion keep the normal cursor behaviour.
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fine) {
  const root = document.documentElement;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<i class="cursor-ring"><b></b></i><i class="cursor-dot"><b></b></i><span class="cursor-label"><b></b></span>';
  document.body.append(cursor);
  root.classList.add('has-cursor');

  const ring = cursor.querySelector('.cursor-ring');
  const dot = cursor.querySelector('.cursor-dot');
  const label = cursor.querySelector('.cursor-label');
  const labelText = label.querySelector('b');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;

  const views = '[data-cursor], .h-card-strip, .h-card-pack, .h-promo, .h-visual, .h-item, .card, .stage, .mega-grid a';
  const labels = [['.h-visual', 'Switch'], ['.h-card-strip', 'Open'], ['.h-card-pack', 'Open'], ['.stage', 'View']];

  const setState = (target) => {
    cursor.classList.remove('is-link', 'is-view', 'is-text');
    if (!target || !(target instanceof Element)) return;
    if (target.closest('textarea, select, [contenteditable], input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]):not([type="button"])')) { cursor.classList.add('is-text'); return; }
    const view = target.closest(views);
    if (view) {
      const custom = view.closest('[data-cursor]')?.getAttribute('data-cursor');
      labelText.textContent = custom || (labels.find(([selector]) => view.closest(selector)) ?? [, 'View'])[1];
      cursor.classList.add('is-view');
      return;
    }
    if (target.closest('a, button, summary, label, input, [role="tab"]')) cursor.classList.add('is-link');
  };

  addEventListener('pointermove', (event) => {
    x = event.clientX;
    y = event.clientY;
    cursor.classList.add('is-on');
  }, { passive: true });
  addEventListener('pointerover', (event) => setState(event.target), { passive: true });
  /* The page moves under a still pointer when scrolling, so re-read what is under it */
  let scrolling = false;
  addEventListener('scroll', () => {
    if (scrolling) return;
    scrolling = true;
    requestAnimationFrame(() => { scrolling = false; setState(document.elementFromPoint(x, y)); });
  }, { passive: true });
  addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));

  /* Ring, dot and label share one position, so the dot always sits at the centre of the ring */
  const follow = () => {
    const ease = reduce || cursor.classList.contains('is-view') ? 1 : 0.5;
    rx += (x - rx) * ease;
    ry += (y - ry) * ease;
    const move = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%)`;
    ring.style.transform = move;
    dot.style.transform = move;
    label.style.transform = move;
    requestAnimationFrame(follow);
  };
  follow();
}

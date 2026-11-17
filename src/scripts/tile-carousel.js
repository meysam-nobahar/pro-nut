// Category tiles on phones: a deck of cards stacked behind one another inside the container.
// Swipe the front card away (or tap an arrow): it slides round to the back of the deck and the next one comes forward.
// The left arrow brings the last card back to the front. Once, on arrival, the front card nudges sideways to show the deck is interactive.
const grid = document.querySelector('.h-intro-grid');
const mq = matchMedia('(max-width: 700px)');

if (grid) {
  const lis = [...grid.children];
  const arrow = (label, d) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
    return b;
  };
  const prev = arrow('Previous category', 'M15 5l-7 7 7 7');
  const next = arrow('Next category', 'M9 5l7 7-7 7');
  const bar = document.createElement('div');
  bar.className = 'h-arrows';
  bar.append(prev, next);
  grid.after(bar);

  const order = lis.slice(); /* order[0] is the front card */
  let drag = null;
  let busy = false;
  let nudged = false;

  /* resting pose of the card at depth p: flat and straight, each one smaller and a little higher so its top edge shows */
  const pose = (p) => {
    const d = Math.min(p, 3);
    return p ? `translate3d(0, ${-d * 15}px, 0) scale(${1 - d * 0.06})` : 'none';
  };
  const place = (skip) => {
    order.forEach((li, p) => {
      if (li === skip) return;
      const tile = li.firstElementChild;
      li.style.zIndex = String(lis.length - p);
      li.inert = p > 0;
      tile.style.transform = pose(p);
      tile.style.filter = `brightness(${p === 0 ? 1 : 0.82 - Math.min(p, 3) * 0.08})`;
      tile.style.opacity = p > 3 ? '0' : '1';
    });
  };
  const out = (dir) => `translate3d(${dir * 115}%, 0, 0) rotate(${dir * 16}deg)`;

  /* throw the front card out to one side, then slide it in behind the deck */
  const fling = (dir) => {
    if (busy) return;
    busy = true;
    nudged = true;
    const li = order.shift();
    order.push(li);
    const tile = li.firstElementChild;
    tile.style.transition = '';
    tile.style.transform = out(dir);
    li.style.zIndex = String(lis.length + 1);
    place(li);
    setTimeout(() => { place(); setTimeout(() => { busy = false; }, 450); }, 320); /* now last in the deck, it glides in behind the others */
  };

  /* the reverse: the last card flies in from the side to the front */
  const back = () => {
    if (busy) return;
    busy = true;
    nudged = true;
    const li = order.pop();
    order.unshift(li);
    const tile = li.firstElementChild;
    tile.style.transition = 'none';
    tile.style.opacity = '1';
    tile.style.transform = out(-1);
    li.style.zIndex = String(lis.length + 1);
    void tile.offsetWidth;
    tile.style.transition = '';
    place();
    setTimeout(() => { busy = false; }, 600);
  };

  prev.addEventListener('click', back);
  next.addEventListener('click', () => fling(-1));

  const down = (e) => {
    if (!mq.matches || busy || !order[0].contains(e.target)) return;
    drag = { x: e.clientX, y: e.clientY, dx: 0, t: performance.now(), moved: false, id: e.pointerId };
  };
  const move = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(drag.dx) > 8 && Math.abs(drag.dx) > Math.abs(e.clientY - drag.y)) {
      drag.moved = true;
      grid.setPointerCapture(e.pointerId);
      order[0].firstElementChild.style.transition = 'none';
    }
    if (drag.moved) order[0].firstElementChild.style.transform = `translate3d(${drag.dx}px, 0, 0) rotate(${drag.dx * 0.06}deg)`;
  };
  const up = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { dx, moved, t } = drag;
    drag = null;
    if (!moved) return;
    grid.dataset.swiped = '1'; /* a swipe must not open the category */
    const fast = Math.abs(dx) / (performance.now() - t) > 0.5;
    if (Math.abs(dx) > grid.clientWidth * 0.25 || (fast && Math.abs(dx) > 30)) fling(Math.sign(dx));
    else { const tile = order[0].firstElementChild; tile.style.transition = ''; tile.style.transform = pose(0); }
  };
  grid.addEventListener('pointerdown', down);
  grid.addEventListener('pointermove', move);
  grid.addEventListener('pointerup', up);
  grid.addEventListener('pointercancel', up);
  grid.addEventListener('click', (e) => { if (grid.dataset.swiped) { e.preventDefault(); delete grid.dataset.swiped; } }, true);

  /* once the deck has come into view and dealt itself in, the front card leans out to the right and back */
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    setTimeout(() => {
      if (nudged || busy || drag || !mq.matches) return;
      const tile = order[0].firstElementChild;
      tile.style.transform = 'translate3d(44px, 0, 0) rotate(4deg)';
      setTimeout(() => { if (!drag && !busy) tile.style.transform = pose(0); }, 520);
    }, 3600);
  }, { threshold: 0.6 });
  io.observe(grid);

  const sync = () => {
    if (mq.matches) place();
    else lis.forEach((li) => { li.style.zIndex = ''; li.inert = false; const t = li.firstElementChild; t.style.transform = t.style.filter = t.style.opacity = t.style.transition = ''; });
  };
  mq.addEventListener('change', sync);
  sync();
}

// Tablets (touch): the first tap on a tile opens its product list, a second tap opens the category.
const tablet = matchMedia('(min-width: 701px) and (max-width: 1000px) and (hover: none)');
if (grid) {
  document.addEventListener('click', (e) => {
    if (!tablet.matches) return;
    const tile = e.target.closest?.('.h-intro-grid .h-tile');
    grid.querySelectorAll('.h-tile.is-active').forEach((t) => { if (t !== tile) t.classList.remove('is-active'); });
    if (tile && !tile.classList.contains('is-active')) { e.preventDefault(); tile.classList.add('is-active'); }
  });
}

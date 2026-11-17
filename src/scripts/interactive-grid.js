// Interactive grid: a square grid fixed behind the page. The cell under the pointer (or a finger) lights up at once
// and fades out slowly once the pointer has moved on, like a trail.
// Same behaviour as the InteractiveGrid component (cell size 28, fill 0.09, grid lines 0.02, edges fade out, 1s fade), written without React.
// One fixed SVG under all content (cards, pictures, text, hero, footer), so the cells only show on the plain background.
const CELL = 28;
const NS = 'http://www.w3.org/2000/svg';

const svg = document.createElementNS(NS, 'svg');
svg.setAttribute('class', 'interactive-grid');
svg.setAttribute('aria-hidden', 'true');
document.body.append(svg);

let cell = CELL, columns = 0, rows = 0, rects = [], active = -1;

const build = () => {
  cell = innerWidth < 760 ? 24 : CELL;
  columns = Math.ceil(innerWidth / cell);
  rows = Math.ceil(innerHeight / cell);
  const frag = document.createDocumentFragment();
  rects = [];
  for (let i = 0; i < columns * rows; i++) {
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', (i % columns) * cell);
    rect.setAttribute('y', Math.floor(i / columns) * cell);
    rect.setAttribute('width', cell);
    rect.setAttribute('height', cell);
    frag.append(rect);
    rects.push(rect);
  }
  svg.replaceChildren(frag);
  active = -1;
};

const light = (index) => {
  if (index === active) return;
  if (active >= 0 && rects[active]) rects[active].classList.remove('is-on');
  active = index;
  if (index >= 0 && rects[index]) rects[index].classList.add('is-on');
};

const at = (event) => {
  const column = Math.floor(event.clientX / cell);
  const row = Math.floor(event.clientY / cell);
  light(column >= 0 && row >= 0 && column < columns && row < rows ? row * columns + column : -1);
};

addEventListener('pointermove', at, { passive: true });
addEventListener('pointerdown', at, { passive: true });
document.documentElement.addEventListener('pointerleave', () => light(-1));
document.addEventListener('visibilitychange', () => { if (document.hidden) light(-1); });

// Touch screens have no hover, so the grid animates by itself: now and then one cell lights up and fades away, quietly.
if (matchMedia('(hover: none)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    if (document.hidden || !rects.length) return;
    const rect = rects[Math.floor(Math.random() * rects.length)];
    rect.classList.add('is-on');
    setTimeout(() => rect.classList.remove('is-on'), 500 + Math.random() * 600);
  }, 240);
}

let timer = 0;
addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(build, 150); });
build();

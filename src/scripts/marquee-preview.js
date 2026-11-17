// Marquee preview: hovering a name in the marquee pops its product (a cut-out with no background) over the name.
// The product springs in, follows the pointer with a little lag, and leans the way the pointer is moving.
// Mouse only: on touch screens the names are plain links.
import gsap from 'gsap';

if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const box = document.createElement('div');
  box.className = 'mq-preview';
  box.setAttribute('aria-hidden', 'true');
  const img = document.createElement('img');
  img.alt = '';
  box.append(img);
  document.body.append(box);

  const SIZE = 230;
  const BASE_TILT = -8;
  const pos = { x: 0, y: 0, tx: 0, ty: 0, lean: 0 };
  let raf = 0;
  let shown = false;

  const loop = () => {
    const dx = (pos.tx - pos.x) * 0.14;
    pos.x += dx;
    pos.y += (pos.ty - pos.y) * 0.14;
    /* lean into the movement, then settle back */
    pos.lean += (Math.max(-18, Math.min(18, dx * 0.9)) - pos.lean) * 0.2;
    gsap.set(box, { x: pos.x - SIZE / 2, y: pos.y - SIZE / 2 + (shown ? 0 : 0), rotate: BASE_TILT + pos.lean });
    raf = shown || Math.abs(pos.tx - pos.x) > 0.5 ? requestAnimationFrame(loop) : 0;
  };

  const show = (src, x, y) => {
    img.src = cutouts.get(src) ?? src;
    pos.tx = x;
    pos.ty = y;
    if (!shown) { pos.x = x; pos.y = y; pos.lean = 0; }
    shown = true;
    if (!raf) raf = requestAnimationFrame(loop);
    gsap.killTweensOf([box, img]);
    gsap.set(box, { autoAlpha: 1 });
    gsap.fromTo(img, { scale: 0.4, yPercent: 30, rotate: -30, opacity: 0 }, { scale: 1, yPercent: -8, rotate: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' });
  };

  const hide = () => {
    shown = false;
    gsap.killTweensOf(img);
    gsap.to(img, { scale: 0.6, yPercent: 20, rotate: 20, opacity: 0, duration: 0.3, ease: 'power3.in', onComplete: () => { if (!shown) gsap.set(box, { autoAlpha: 0 }); } });
  };

  /* The product photos have a white background: flood it away from the edges (so white labels inside the pack stay) and soften the rim */
  const cutouts = new Map();
  const cutOut = (src) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const w = image.naturalWidth, h = image.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, 0, 0);
      const px = ctx.getImageData(0, 0, w, h), d = px.data;
      const white = (i) => d[i * 4] > 238 && d[i * 4 + 1] > 238 && d[i * 4 + 2] > 238;
      const bg = new Uint8Array(w * h), stack = [];
      const push = (i) => { if (!bg[i] && white(i)) { bg[i] = 1; stack.push(i); } };
      for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
      while (stack.length) {
        const i = stack.pop(), x = i % w;
        if (x > 0) push(i - 1);
        if (x < w - 1) push(i + 1);
        if (i >= w) push(i - w);
        if (i < w * (h - 1)) push(i + w);
      }
      for (let i = 0; i < w * h; i++) {
        if (bg[i]) { d[i * 4 + 3] = 0; continue; }
        const x = i % w;
        const edge = (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (i >= w && bg[i - w]) || (i < w * (h - 1) && bg[i + w]);
        if (edge) d[i * 4 + 3] = Math.min(255, Math.max(0, (255 - Math.min(d[i * 4], d[i * 4 + 1], d[i * 4 + 2])) * 5));
      }
      ctx.putImageData(px, 0, 0);
      canvas.toBlob((blob) => { if (blob) cutouts.set(src, URL.createObjectURL(blob)); resolve(); });
    };
    image.onerror = resolve;
    image.src = src;
  });
  const preload = () => [...new Set([...document.querySelectorAll('.h-mq-item[data-preview]')].map((el) => el.dataset.preview))].forEach(cutOut);
  addEventListener('load', () => setTimeout(preload, 1200), { once: true });

  const seen = new Set();
  document.querySelectorAll('.h-mq-item[data-preview]').forEach((item) => {
    const src = item.dataset.preview;
    item.addEventListener('pointerenter', (e) => {
      if (!seen.has(src)) { seen.add(src); new Image().src = src; }
      const r = item.getBoundingClientRect();
      show(src, e.clientX, r.top + r.height / 2);
    });
    item.addEventListener('pointermove', (e) => { pos.tx = e.clientX; });
    item.addEventListener('pointerleave', hide);
  });
}

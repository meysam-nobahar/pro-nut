// Hex trail: large black honeycomb cells appear around the pointer (or a finger) and fade out behind it.
// One fixed canvas under all content (cards, pictures, text, hero, footer), so the cells only show on the plain background.
// Light on the device: only the few cells near the pointer are tracked and drawn, and the loop stops itself once everything has faded.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const SQRT3 = Math.sqrt(3);
  const canvas = document.createElement('canvas');
  canvas.className = 'hex-trail';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0, radius = 56, cols = 0, rows = 0;
  let energy = new Float32Array(0);
  let flag = new Uint8Array(0);
  let active = [];
  let raf = 0;
  const ripples = [];
  const RIPPLE_MS = 3200;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, on: false, seen: false };

  const resize = () => {
    width = innerWidth;
    height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    radius = width < 760 ? 40 : 56;
    cols = Math.ceil(width / (SQRT3 * radius)) + 2;
    rows = Math.ceil(height / (1.5 * radius)) + 2;
    energy = new Float32Array(cols * rows);
    flag = new Uint8Array(cols * rows);
    active = [];
  };

  const centerX = (col, row) => (col + (row % 2 ? 0.5 : 0)) * SQRT3 * radius;
  const centerY = (row) => row * 1.5 * radius;

  const drawCell = (cx, cy, e) => {
    const r = radius - 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    for (let i = 1; i < 6; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 3;
      ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(10, 10, 10, ${(0.022 * e).toFixed(3)})`;
    ctx.fill();
    ctx.lineWidth = 1 + 0.6 * e;
    ctx.strokeStyle = `rgba(10, 10, 10, ${(0.15 * e).toFixed(3)})`;
    ctx.stroke();
  };

  const step = () => {
    raf = 0;
    if (pointer.on) {
      pointer.sx += (pointer.x - pointer.sx) * 0.3;
      pointer.sy += (pointer.y - pointer.sy) * 0.3;
      const reach = radius * 2.7;
      const c0 = Math.max(0, Math.floor((pointer.sx - reach) / (SQRT3 * radius)) - 1);
      const c1 = Math.min(cols - 1, Math.ceil((pointer.sx + reach) / (SQRT3 * radius)) + 1);
      const r0 = Math.max(0, Math.floor((pointer.sy - reach) / (1.5 * radius)) - 1);
      const r1 = Math.min(rows - 1, Math.ceil((pointer.sy + reach) / (1.5 * radius)) + 1);
      for (let row = r0; row <= r1; row++) {
        for (let col = c0; col <= c1; col++) {
          const d = Math.hypot(centerX(col, row) - pointer.sx, centerY(row) - pointer.sy);
          if (d >= reach) continue;
          const i = row * cols + col;
          const e = 1 - d / reach;
          if (e > energy[i]) energy[i] = e;
          if (!flag[i]) { flag[i] = 1; active.push(i); }
        }
      }
    }

    /* touch screens have no pointer, so a faint ripple of cells spreads from a random spot now and then */
    if (ripples.length) {
      const now = performance.now();
      for (let r = ripples.length - 1; r >= 0; r--) {
        const age = (now - ripples[r].t0) / RIPPLE_MS;
        if (age >= 1) { ripples.splice(r, 1); continue; }
        const ring = age * radius * 7;
        const reach = ring + radius * 1.4;
        const rx = ripples[r].x, ry = ripples[r].y;
        const c0 = Math.max(0, Math.floor((rx - reach) / (SQRT3 * radius)) - 1);
        const c1 = Math.min(cols - 1, Math.ceil((rx + reach) / (SQRT3 * radius)) + 1);
        const r0 = Math.max(0, Math.floor((ry - reach) / (1.5 * radius)) - 1);
        const r1 = Math.min(rows - 1, Math.ceil((ry + reach) / (1.5 * radius)) + 1);
        for (let row = r0; row <= r1; row++) {
          for (let col = c0; col <= c1; col++) {
            const d = Math.hypot(centerX(col, row) - rx, centerY(row) - ry);
            const band = (d - ring) / (radius * 1.1);
            const e = Math.exp(-band * band) * (1 - age) * 0.75;
            if (e < 0.05) continue;
            const i = row * cols + col;
            if (e > energy[i]) energy[i] = e;
            if (!flag[i]) { flag[i] = 1; active.push(i); }
          }
        }
      }
    }

    ctx.clearRect(0, 0, width, height);
    for (let k = active.length - 1; k >= 0; k--) {
      const i = active[k];
      energy[i] *= 0.92;
      if (energy[i] < 0.03) {
        energy[i] = 0;
        flag[i] = 0;
        active[k] = active[active.length - 1];
        active.pop();
        continue;
      }
      const col = i % cols, row = (i - col) / cols;
      drawCell(centerX(col, row), centerY(row), energy[i]);
    }
    if (pointer.on || active.length || ripples.length) raf = requestAnimationFrame(step);
    else ctx.clearRect(0, 0, width, height);
  };

  const wake = () => { if (!raf) raf = requestAnimationFrame(step); };

  addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (!pointer.seen) { pointer.sx = pointer.x; pointer.sy = pointer.y; pointer.seen = true; }
    pointer.on = true;
    wake();
  }, { passive: true });
  const off = () => { pointer.on = false; pointer.seen = false; wake(); };
  addEventListener('pointerup', (event) => { if (event.pointerType !== 'mouse') off(); });
  addEventListener('pointercancel', off);
  document.documentElement.addEventListener('mouseleave', off);
  document.addEventListener('visibilitychange', () => { if (document.hidden) off(); });

  let timer = 0;
  addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(resize, 150); });
  resize();

  /* no mouse (phones, tablets): the cells animate on their own, softly and only now and then */
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let timer2 = 0;
    const spawn = () => {
      if (!document.hidden) {
        ripples.push({ x: width * (0.12 + Math.random() * 0.76), y: height * (0.15 + Math.random() * 0.7), t0: performance.now() });
        wake();
      }
      timer2 = setTimeout(spawn, 3600 + Math.random() * 3400);
    };
    timer2 = setTimeout(spawn, 1800);
  }
}

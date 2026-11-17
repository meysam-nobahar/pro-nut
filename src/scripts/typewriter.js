// Typewriter: one word in the second section's headline types itself out, waits, deletes, and types the next.
// It starts only once the section has been reached (and its own reveal has played), and is skipped with reduced motion.
const el = document.querySelector('[data-typewriter]');
if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const words = JSON.parse(el.dataset.words || '[]');
  const text = el.querySelector('.h-type-text');
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let running = false;

  const run = async () => {
    if (running || words.length < 2) return;
    running = true;
    let i = 1;
    await sleep(5200); /* the section's own reveal takes about five seconds */
    for (;;) {
      if (document.hidden) { await sleep(500); continue; }
      const word = words[i % words.length];
      /* delete the word on screen one letter at a time, then type the next one */
      for (let n = text.textContent.length; n > 0; n--) { text.textContent = text.textContent.slice(0, n - 1); await sleep(45); }
      await sleep(260);
      for (let n = 1; n <= word.length; n++) { text.textContent = word.slice(0, n); await sleep(85 + Math.random() * 70); }
      el.classList.add('is-resting');
      await sleep(2300);
      el.classList.remove('is-resting');
      i++;
    }
  };

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); run(); }
  }, { threshold: 0.4 });
  io.observe(el);
}

// Marquee speed: the marquee runs faster while the page is being scrolled, then eases back to its own pace.
const track = document.querySelector('.h-mq-track');
if (track && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let last = scrollY;
  let boost = 0;
  let raf = 0;
  const animation = () => track.getAnimations()[0];

  const tick = () => {
    const now = scrollY;
    boost = Math.max(boost * 0.94, Math.min(Math.abs(now - last) * 0.25, 7));
    last = now;
    const a = animation();
    if (a) a.playbackRate = 1 + boost;
    if (boost > 0.02) raf = requestAnimationFrame(tick);
    else { if (a) a.playbackRate = 1; raf = 0; }
  };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
}

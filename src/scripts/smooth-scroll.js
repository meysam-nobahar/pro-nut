// Smooth, weighted scrolling (Lenis) wired into GSAP ScrollTrigger. Off with reduced motion; touch screens keep native scrolling.
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({
    lerp: 0.075,
    wheelMultiplier: 0.85,
    smoothWheel: true,
    anchors: { offset: -96 },
  });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

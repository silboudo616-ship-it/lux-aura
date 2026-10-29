import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from './gsap';
import './motion.css';

/* Curseur doré : uniquement sur souris (pointer: fine).
   quickTo réutilise une seule animation au lieu d'en créer une par mouvement. */
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);

  useGSAP(() => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return undefined;
    document.documentElement.classList.add('has-cursor');

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.15, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.15, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' });

    let shown = false;
    const move = (e) => {
      if (!shown) {
        // Premier mouvement : on place le curseur sans glissement depuis le coin (0,0).
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY, autoAlpha: 1 });
        shown = true;
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e) => {
      const hit = e.target.closest('a, button, input, [data-cursor]');
      ring.current.classList.toggle('cursor__ring--hover', !!hit);
      ring.current.dataset.label = hit?.dataset.cursor || '';
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.classList.remove('has-cursor');
    };
  });

  return (
    <>
      <span className="cursor__dot" ref={dot} aria-hidden="true" />
      <span className="cursor__ring" ref={ring} aria-hidden="true" />
    </>
  );
};

export default Cursor;

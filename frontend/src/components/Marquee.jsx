import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../motion/gsap';
import '../motion/motion.css';

const WORDS = ['Haute Parfumerie', 'Éditions Numérotées', 'Sillage Rare', 'Maison LUX AURA'];

/* Bandeau infini : la vitesse et le sens suivent la vélocité du scroll. */
const Marquee = () => {
  const root = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    // Le contenu est dupliqué : à -50 %, la 2ᵉ copie occupe exactement la place de la 1ʳᵉ.
    const loop = gsap.to('.marquee__track', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });

    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const dir = self.direction; // 1 = vers le bas, -1 = vers le haut
        const boost = gsap.utils.clamp(1, 5, Math.abs(self.getVelocity()) / 250);
        gsap.to(loop, {
          timeScale: dir * boost,
          duration: 0.25,
          overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2, overwrite: true }),
        });
      },
    });
  }, { scope: root });

  const items = [...WORDS, ...WORDS];
  return (
    <div className="marquee" ref={root} aria-label={WORDS.join(', ')}>
      <div className="marquee__track" aria-hidden="true">
        {items.map((w, i) => (
          <span className="marquee__item" key={i}>
            {i % 2 ? <em>{w}</em> : w}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;

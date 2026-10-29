import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from './gsap';
import './motion.css';

const SESSION_KEY = 'luxaura_intro_seen';

const alreadySeen = () => {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
};

/* Rideau d'ouverture : joué une fois par session. */
const Preloader = () => {
  const [done, setDone] = useState(() => alreadySeen() || prefersReducedMotion());
  const root = useRef(null);

  useGSAP(() => {
    if (done) return;
    document.documentElement.classList.add('is-intro');
    const finish = () => {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* navigation privée */ }
      document.documentElement.classList.remove('is-intro');
      window.dispatchEvent(new Event('luxaura:intro-done'));
      setDone(true);
    };

    gsap.timeline({ onComplete: finish })
      .from('.intro__letter', { yPercent: 110, stagger: 0.06, duration: 1 })
      .from('.intro__line', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, '-=0.6')
      .from('.intro__tag', { autoAlpha: 0, y: 10, duration: 0.8 }, '-=0.5')
      .to('.intro__inner', { autoAlpha: 0, y: -20, duration: 0.6, ease: 'power2.in' }, '+=0.35')
      .to('.intro__panel', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: 0.08 }, '-=0.15');
  }, { scope: root, dependencies: [] });

  if (done) return null;

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__panel intro__panel--back" />
      <div className="intro__panel">
        <div className="intro__inner">
          <p className="intro__word">
            {'LUX AURA'.split('').map((c, i) => (
              <span className="intro__mask" key={i}>
                <span className="intro__letter">{c === ' ' ? ' ' : c}</span>
              </span>
            ))}
          </p>
          <span className="intro__line" />
          <p className="intro__tag">Haute Parfumerie</p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

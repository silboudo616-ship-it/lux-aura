import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../motion/gsap';
import './Hero.css';

export const HERO_IMG =
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=2000';

const Hero = () => {
  const root = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Compteur 000 → 087 : GSAP anime un simple objet, on recopie sa valeur dans le DOM.
    const badgeNum = root.current.querySelector('.hero__badge-number');
    const counter = { value: 0 };
    badgeNum.textContent = '000';

    const split = SplitText.create('.hero__title', { type: 'lines,chars', mask: 'lines', linesClass: 'split-mask' });

    const intro = gsap.timeline({ paused: true, defaults: { duration: 1.4 } })
      .from('.hero__bg-img', { scale: 1.25, duration: 2.6, ease: 'expo.out' }, 0)
      .from(split.chars, { yPercent: 120, rotate: 6, stagger: 0.035 }, 0.2)
      .from('.hero__eyebrow', { autoAlpha: 0, x: -30 }, 0.4)
      .from(['.hero__subtitle', '.hero__desc', '.hero__ctas'], { autoAlpha: 0, y: 30, stagger: 0.12 }, 0.7)
      .from('.hero__visual-frame', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut' }, 0.3)
      .from('.hero__visual-img', { scale: 1.4, duration: 2 }, 0.3)
      .from('.hero__ring', { autoAlpha: 0, scale: 0.6, duration: 1.8 }, 0.8)
      .from('.hero__badge', { autoAlpha: 0, y: 30 }, 1.2)
      .to(counter, {
        value: 87, duration: 2, ease: 'power2.out',
        onUpdate: () => { badgeNum.textContent = String(Math.round(counter.value)).padStart(3, '0'); },
      }, 1.2)
      .from('.hero__scroll', { autoAlpha: 0 }, 1.6);

    // On attend la fin du rideau d'ouverture s'il est affiché.
    const play = () => intro.play();
    if (document.documentElement.classList.contains('is-intro')) {
      window.addEventListener('luxaura:intro-done', play, { once: true });
    } else play();

    // Parallax au scroll : chaque couche se déplace à une vitesse différente.
    const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__bg', { yPercent: 25, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__text', { yPercent: -18, autoAlpha: 0.2, ease: 'none', scrollTrigger: st });
    gsap.to('.hero__visual', { yPercent: -35, ease: 'none', scrollTrigger: st });

    return () => window.removeEventListener('luxaura:intro-done', play);
  }, { scope: root });

  return (
    <section className="hero" aria-label="Introduction LUX AURA" ref={root}>
      <div className="hero__bg">
        <img src={HERO_IMG} alt="" aria-hidden="true" className="hero__bg-img" loading="eager" fetchPriority="high" />
        <div className="hero__bg-overlay" />
        <div className="hero__grain" />
      </div>

      <div className="hero__grid">
        <div className="hero__text">
          <p className="hero__eyebrow t-label">Maison de Parfums · Depuis 2020</p>
          <h1 className="hero__title t-display">
            L'Art du<br />
            <em>Parfum.</em>
          </h1>
          <p className="hero__subtitle">L'exclusivité comme signature.</p>
          <p className="hero__desc">
            Des fragrances d'exception, conçues pour les esthètes en quête
            de rareté et de raffinement absolu.
          </p>
          <div className="hero__ctas">
            <Link to="/collections" className="btn btn--gold" data-cursor="Voir">
              Découvrir la Collection
            </Link>
            <Link to="/collections?level=Master" className="hero__link-secondary">
              Explorer Master Collection <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <svg className="hero__ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="hero-ring-path" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
            </defs>
            <text>
              <textPath href="#hero-ring-path">
                HAUTE PARFUMERIE ✦ LUX AURA ✦ ÉDITIONS RARES ✦ SILLAGE D'EXCEPTION ✦
              </textPath>
            </text>
          </svg>
          <div className="hero__visual-frame">
            <img
              src={`${import.meta.env.BASE_URL}logo.jpg`}
              alt="Emblème LUX AURA"
              className="hero__visual-img"
              loading="eager"
            />
          </div>
          <div className="hero__badge">
            <span className="hero__badge-number">087</span>
            <span className="hero__badge-sep">/ 300</span>
            <span className="hero__badge-label">Pièces Master</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="t-label hero__scroll-label">Défiler</span>
      </div>
    </section>
  );
};

export default Hero;

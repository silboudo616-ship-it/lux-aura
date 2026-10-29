import React, { useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flip } from 'gsap/Flip';
import { useProducts } from '../context/ProductContext';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../motion/gsap';
import Sillage from '../home/Sillage';
import PerfumeCard from '../components/PerfumeCard';
import { img, GENRES, LEVELS, DEFAULT_PHOTO } from '../home/media';
import './Collections.css';

gsap.registerPlugin(Flip);

const Collections = () => {
  const { products, collections, genders } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const gender = searchParams.get('gender') || '';
  const level = searchParams.get('level') || '';
  const root = useRef(null);
  const flipState = useRef(null);

  const filtered = products.filter((p) => (!gender || p.gender === gender) && (!level || p.collection === level));
  const genre = GENRES.find((g) => g.key === gender);
  const title = [genre?.label, level].filter(Boolean).join(' ') || 'Nos créations';
  const lead = (level && LEVELS[level]) || genre?.line || 'Toutes nos créations, d’Orient et d’Occident.';
  const photo = genre ?? { photo: DEFAULT_PHOTO };

  /* Changement de filtre : Flip mémorise la grille avant, puis anime vers la nouvelle. */
  const setFilter = (type, value) => {
    if (!prefersReducedMotion()) flipState.current = Flip.getState(root.current.querySelectorAll('.lx-card'));
    const p = new URLSearchParams(searchParams);
    if (value) p.set(type, value); else p.delete(type);
    setSearchParams(p, { replace: true });
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.75, ease: 'expo.out', absolute: true, scale: true, nested: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.3 }),
    });
    flipState.current = null;
  }, [gender, level]);

  /* Titre : rejoué à chaque changement d'univers (lettres qui montent, sillage qui suit). */
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const split = SplitText.create(q('.cl-hero__title .sillage__text')[0], { type: 'words,chars', mask: 'chars', charsClass: 'sl-char', wordsClass: 'sl-word' });
    q('.cl-hero__title .sillage__echo').forEach((e) => SplitText.create(e, { type: 'words,chars', charsClass: 'sl-char', wordsClass: 'sl-word' }));
    gsap.timeline()
      .from(split.chars, { yPercent: 115, stagger: 0.035, duration: 1.1, ease: 'expo.out' })
      .from(q('.cl-hero__title .sillage__echo'), { yPercent: -50, autoAlpha: 0, stagger: 0.08, duration: 1.1 }, 0.25)
      .from(q('.cl-hero__lead, .cl-hero__count'), { autoAlpha: 0, y: 20, stagger: 0.08, duration: 0.8 }, 0.35)
      .fromTo(q('.cl-hero__photo'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.inOut' }, 0);
  }, { scope: root, dependencies: [title], revertOnUpdate: true });

  /* Arrivée de la grille et parallax de la photo (une seule fois). */
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.from(q('.lx-card'), { y: 60, autoAlpha: 0, stagger: 0.06, duration: 1, delay: 0.3 });
    gsap.to(q('.cl-hero__photo img'), {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: q('.cl-hero')[0], start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: root });

  const chip = (type, value, current, label = value) => (
    <button key={label} type="button" className="lx-chip cl-chip" aria-pressed={current === value} onClick={() => setFilter(type, value)}>
      {label}
    </button>
  );

  return (
    <div className="cl" ref={root}>
      <header className="cl-hero">
        <div className="cl-hero__text">
          <Sillage as="h1" className="cl-hero__title" key={title}>{title}</Sillage>
          <p className="cl-hero__lead">{lead}</p>
          <p className="cl-hero__count">{filtered.length} parfum{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <figure className="cl-hero__photo" key={photo.photo} aria-hidden="true">
          <img src={img(photo.photo, 1100)} alt="" style={photo.focus ? { objectPosition: photo.focus } : undefined} />
        </figure>
      </header>

      <nav className="cl-bar" aria-label="Filtrer les parfums">
        <div className="cl-bar__group" role="group" aria-label="Genre">
          <span className="cl-bar__label">Pour</span>
          {chip('gender', '', gender, 'Tous')}
          {genders.map((g) => chip('gender', g, gender))}
        </div>
        <div className="cl-bar__group" role="group" aria-label="Collection">
          <span className="cl-bar__label">Collection</span>
          {chip('level', '', level, 'Toutes')}
          {collections.map((c) => chip('level', c, level))}
        </div>
      </nav>

      <section className="cl-body" aria-label="Parfums">
        {filtered.length === 0 ? (
          <div className="cl-empty">
            <p className="cl-empty__title">Aucun parfum pour cette combinaison.</p>
            <p>Choisissez une autre collection, ou retirez un filtre.</p>
            <button type="button" className="lx-btn lx-btn--dark" onClick={() => setSearchParams({}, { replace: true })}>
              Voir tous les parfums
            </button>
          </div>
        ) : (
          <ul className="lx-grid">
            {filtered.map((p) => <PerfumeCard key={p.id} perfume={p} />)}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Collections;

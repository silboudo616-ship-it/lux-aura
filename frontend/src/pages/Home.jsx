import React, { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flip } from 'gsap/Flip';
import { useProducts } from '../context/ProductContext';
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from '../motion/gsap';
import { bottle, POSES, POSES_MOBILE } from '../home/bottleState';
import Sillage from '../home/Sillage';
import './Home.css';

gsap.registerPlugin(Flip);

// Le moteur 3D (~150 kB) n'est téléchargé qu'une fois la page affichée.
const Bottle3D = lazy(() => import('../home/Bottle3D'));

const img = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;
const GENRES = [
  { key: 'Hommes', label: 'Homme', line: 'Boisés, épicés, ambrés.', photo: 'photo-1702065613116-620168beb732', focus: '22% 40%' },
  { key: 'Femmes', label: 'Femme', line: 'Floraux, vanillés, lumineux.', photo: 'photo-1623538244675-b97056120ab1' },
  { key: 'Mixte',  label: 'Mixte', line: 'Oud, musc, cuir : à partager.', photo: 'photo-1609255836143-3480a093a35b' },
];
const BAND = ['photo-1720366788970-1f42a5e958dd', 'photo-1728140639942-6a8ed398d2d7', 'photo-1623538244675-b97056120ab1', 'photo-1609255836143-3480a093a35b'];
const NOTES = [
  { name: 'Tête', when: 'Les premières minutes', what: 'Bergamote, poivre rose, agrumes.' },
  { name: 'Cœur', when: 'Les heures qui suivent', what: 'Jasmin, rose, fleur d’oranger.' },
  { name: 'Fond', when: 'Ce qui reste le soir', what: 'Santal, oud, vanille, musc.' },
];
const FILTERS = ['Tous', 'Hommes', 'Femmes', 'Mixte'];

/* Révélation d'un titre sillage dans une timeline : lignes masquées puis copies qui suivent. */
function addSillage(tl, el, at = 0, { dur = 1 } = {}) {
  if (!el) return;
  const split = SplitText.create(el.querySelector('.sillage__text'), { type: 'lines', mask: 'lines', linesClass: 'sl-line' });
  tl.from(split.lines, { yPercent: 115, stagger: 0.08, duration: dur, ease: 'expo.out' }, at)
    .from(el.querySelectorAll('.sillage__echo'), {
      yPercent: -60, autoAlpha: 0, stagger: 0.06, duration: dur * 1.2, ease: 'power3.out',
    }, at + dur * 0.25);
}

const Home = () => {
  const root = useRef(null);
  const { products } = useProducts();
  const [stageOn, setStageOn] = useState(true);
  const [filter, setFilter] = useState('Tous');
  const flipState = useRef(null);

  const counts = useMemo(() => Object.fromEntries(
    GENRES.map((g) => [g.key, products.filter((p) => p.gender === g.key).length]),
  ), [products]);
  const shown = useMemo(
    () => products.filter((p) => filter === 'Tous' || p.gender === filter).slice(0, 8),
    [products, filter],
  );
  const master = products.find((p) => p.collection === 'Master' && p.masterDetails);

  /* Filtres : Flip mémorise les positions avant le changement, puis anime vers les nouvelles. */
  const changeFilter = (f) => {
    if (f === filter) return;
    flipState.current = Flip.getState(root.current.querySelectorAll('.lx-card'));
    setFilter(f);
  };
  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.7, ease: 'expo.out', absolute: true, scale: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.3 }),
    });
    flipState.current = null;
  }, [filter]);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const reduce = prefersReducedMotion();

    /* Souris : le flacon s'oriente légèrement vers le pointeur (desktop). */
    const onMove = (e) => {
      bottle.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      bottle.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    /* Scène 3D active seulement de l'ouverture jusqu'à "Dans le flacon".
       Créé après l'épinglage (ordre du document) pour que sa fin tienne compte de l'espace ajouté. */
    const stageToggle = () => ScrollTrigger.create({
      trigger: q('.lx-hero')[0], start: 'top bottom',
      endTrigger: q('.lx-inside')[0], end: 'bottom top',
      onToggle: (self) => setStageOn(self.isActive),
    });

    if (reduce) {
      Object.assign(bottle, POSES.hero);
      stageToggle();
      return () => window.removeEventListener('pointermove', onMove);
    }

    const mm = gsap.matchMedia();
    mm.add({ desk: '(min-width: 900px)', mob: '(max-width: 899px)' }, (ctx) => {
      const P = ctx.conditions.desk ? POSES : POSES_MOBILE;
      Object.assign(bottle, P.hero, { y: P.hero.y - 0.9, scale: 0.6 });

      /* S1 · Ouverture : le titre monte lettre par lettre, le flacon descend se poser. */
      const title = SplitText.create(q('.lx-hero__title .sillage__text')[0], { type: 'chars', mask: 'chars', charsClass: 'sl-char' });
      // Les copies sont découpées de la même façon : sinon leur mise en page diffère du texte découpé.
      q('.lx-hero__title .sillage__echo').forEach((e) => SplitText.create(e, { type: 'chars', charsClass: 'sl-char' }));
      gsap.timeline({ delay: 0.15 })
        .from(title.chars, { yPercent: 110, stagger: 0.06, duration: 1.4, ease: 'expo.out' })
        .from(q('.lx-hero__title .sillage__echo'), { yPercent: -40, autoAlpha: 0, stagger: 0.08, duration: 1.4 }, 0.5)
        .to(bottle, { ...P.hero, duration: 2, ease: 'expo.out' }, 0.2)
        .from(q('.lx-hero__foot > *'), { autoAlpha: 0, y: 24, stagger: 0.1, duration: 1 }, 0.9);

      // En quittant le hero, le titre glisse plus lentement que la page (profondeur).
      gsap.to(q('.lx-hero__title'), {
        yPercent: 35, ease: 'none',
        scrollTrigger: { trigger: q('.lx-hero')[0], start: 'top top', end: 'bottom top', scrub: true },
      });

      /* S2 · Voyage du flacon : section épinglée, 3 chapitres synchronisés avec 3 poses. */
      const chapters = q('.lx-chapter');
      const journey = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: q('.lx-journey')[0], start: 'top top', end: '+=320%', scrub: 1, pin: true,
          anticipatePin: 1,
        },
      });
      journey.to(bottle, { ...P.reveal, duration: 1 }, 0);
      addSillage(journey, chapters[0].querySelector('.sillage'), 0.2);
      journey.from(chapters[0].querySelector('p'), { autoAlpha: 0, y: 30, duration: 0.6 }, 0.6)
        .to(chapters[0], { autoAlpha: 0, y: -60, duration: 0.6 }, 1.7)
        .to(bottle, { ...P.angle, duration: 1.2 }, 1.7)
        .to(q('.lx-journey__night'), { opacity: 0.55, duration: 1.2, ease: 'none' }, 1.7);
      addSillage(journey, chapters[1].querySelector('.sillage'), 2.1);
      journey.from(chapters[1].querySelector('p'), { autoAlpha: 0, y: 30, duration: 0.6 }, 2.5)
        .to(chapters[1], { autoAlpha: 0, y: -60, duration: 0.6 }, 3.6)
        .to(bottle, { ...P.trace, duration: 1.2 }, 3.6)
        .to(q('.lx-journey__night'), { opacity: 1, duration: 1.2, ease: 'none' }, 3.6);
      addSillage(journey, chapters[2].querySelector('.sillage'), 4);
      journey.from(chapters[2].querySelector('p'), { autoAlpha: 0, y: 30, duration: 0.6 }, 4.4)
        .to({}, { duration: 0.6 }, 5); // un temps de pause avant de relâcher l'épinglage

      /* S3 · Dans le flacon : le flacon se pose dans le panneau blanc. */
      gsap.timeline({
        scrollTrigger: { trigger: q('.lx-inside')[0], start: 'top 85%', end: 'top 15%', scrub: 1 },
      }).to(bottle, { ...P.inside, ease: 'power2.inOut' });
      gsap.from(q('.lx-note'), {
        autoAlpha: 0, x: -40, stagger: 0.15, duration: 1,
        scrollTrigger: { trigger: q('.lx-inside__notes')[0], start: 'top 70%' },
      });
      // Sortie : le flacon s'efface avec la fin de la scène.
      stageToggle();
      gsap.to(q('.lx-stage'), {
        autoAlpha: 0, ease: 'none',
        scrollTrigger: {
          trigger: q('.lx-inside')[0],
          start: ctx.conditions.desk ? 'bottom 75%' : 'top 70%',
          end: ctx.conditions.desk ? 'bottom 25%' : 'top 30%',
          scrub: true,
        },
      });

      /* S4 · Homme / Femme / Mixte : panneaux qui se lèvent, photos en parallax. */
      const genresTl = gsap.timeline({ scrollTrigger: { trigger: q('.lx-genres')[0], start: 'top 70%' } });
      addSillage(genresTl, q('.lx-genres .sillage')[0], 0);
      genresTl.from(q('.lx-genre'), { clipPath: 'inset(100% 0 0 0)', stagger: 0.12, duration: 1.4, ease: 'expo.inOut' }, 0.2);
      q('.lx-genre__img').forEach((im) => gsap.fromTo(im, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }));

      /* S5 · Collection : bandeau incliné qui glisse, titre géant, cartes. */
      gsap.fromTo(q('.lx-band__track'), { xPercent: 0 }, {
        xPercent: -30, ease: 'none',
        scrollTrigger: { trigger: q('.lx-band')[0], start: 'top bottom', end: 'bottom top', scrub: true },
      });
      const colTl = gsap.timeline({ scrollTrigger: { trigger: q('.lx-collection__head')[0], start: 'top 75%' } });
      addSillage(colTl, q('.lx-collection .sillage')[0], 0);
      gsap.from(q('.lx-card'), {
        y: 70, autoAlpha: 0, stagger: 0.08, duration: 1,
        scrollTrigger: { trigger: q('.lx-grid')[0], start: 'top 80%' },
      });

      /* S6 · Finale Master : compteur et photo en parallax. */
      const fin = q('.lx-finale')[0];
      const finTl = gsap.timeline({ scrollTrigger: { trigger: fin, start: 'top 65%' } });
      addSillage(finTl, fin.querySelector('.sillage'), 0);
      finTl.from(fin.querySelectorAll('.lx-finale__body > :not(.sillage)'), { autoAlpha: 0, y: 30, stagger: 0.1, duration: 0.9 }, 0.4);
      const num = fin.querySelector('.lx-finale__num');
      if (num && master) {
        const c = { v: master.masterDetails.total };
        finTl.to(c, {
          v: master.masterDetails.available, duration: 2, ease: 'power2.out',
          onUpdate: () => { num.textContent = Math.round(c.v); },
        }, 0.3);
      }
      gsap.fromTo(fin.querySelector('.lx-finale__photo img'), { yPercent: -10 }, {
        yPercent: 10, ease: 'none', scrollTrigger: { trigger: fin, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    return () => window.removeEventListener('pointermove', onMove);
  }, { scope: root });

  return (
    <div className="lx" ref={root}>
      {/* Couche 3D fixe, entre les fonds de section et les textes "de premier plan". */}
      <div className="lx-stage" aria-hidden="true">
        <Suspense fallback={null}>
          <Bottle3D active={stageOn} />
        </Suspense>
      </div>

      {/* S1 · OUVERTURE */}
      <section className="lx-hero" aria-label="LUX AURA">
        <Sillage as="h1" className="lx-hero__title" aria-label="L'Aura">L’AURA</Sillage>
        <div className="lx-hero__foot">
          <p className="lx-hero__intro">
            Des parfums choisis pour celles et ceux qui veulent laisser une trace.
          </p>
          <a href="#collection" className="lx-btn lx-btn--light">Voir les parfums</a>
        </div>
      </section>

      {/* S2 · VOYAGE DU FLACON */}
      <section className="lx-journey" aria-label="Le flacon">
        <div className="lx-journey__night" aria-hidden="true" />
        <div className="lx-chapter lx-chapter--left">
          <Sillage>Révéler sa présence</Sillage>
          <p>Un sillage se remarque avant vous. Il annonce, il accompagne, il reste.</p>
        </div>
        <div className="lx-chapter lx-chapter--right">
          <Sillage>Un autre angle du luxe</Sillage>
          <p>Des jus de maisons d’Orient et d’Occident, choisis un à un, à des prix pensés pour être portés chaque jour.</p>
        </div>
        <div className="lx-chapter lx-chapter--center">
          <Sillage>Laisser une trace</Sillage>
          <p>Tête, cœur, fond : un parfum se raconte en trois temps.</p>
        </div>
      </section>

      {/* S3 · DANS LE FLACON */}
      <section className="lx-inside">
        <div className="lx-inside__notes">
          <h2 className="lx-inside__title">Dans le flacon</h2>
          <ol className="lx-notes">
            {NOTES.map((n) => (
              <li className="lx-note" key={n.name}>
                <span className="lx-note__name">{n.name}</span>
                <span className="lx-note__when">{n.when}</span>
                <span className="lx-note__what">{n.what}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="lx-inside__light" aria-hidden="true" />
      </section>

      {/* S4 · HOMME / FEMME / MIXTE */}
      <section className="lx-genres" aria-label="Parfums par genre">
        <Sillage className="lx-genres__title">Pour lui, pour elle, pour deux</Sillage>
        <div className="lx-genres__row">
          {GENRES.map((g) => (
            <Link key={g.key} to={`/collections?gender=${g.key}`} className="lx-genre">
              <img className="lx-genre__img" src={img(g.photo, 1000)} alt={`Parfum ${g.label.toLowerCase()}`} loading="lazy" style={g.focus ? { objectPosition: g.focus } : undefined} />
              <span className="lx-genre__shade" aria-hidden="true" />
              <span className="lx-genre__name">{g.label}</span>
              <span className="lx-genre__meta">
                {g.line}<br />
                {counts[g.key]} parfum{counts[g.key] > 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* S5 · COLLECTION */}
      <section className="lx-collection" id="collection">
        <div className="lx-band" aria-hidden="true">
          <div className="lx-band__track">
            {[...BAND, ...BAND].map((id, i) => (
              <img key={i} src={img(id, 700)} alt="" loading="lazy" />
            ))}
          </div>
        </div>

        <div className="lx-collection__head">
          <Sillage>Libérez l’aura</Sillage>
          <div className="lx-filters" role="group" aria-label="Filtrer les parfums">
            {FILTERS.map((f) => (
              <button key={f} type="button" className="lx-chip" aria-pressed={filter === f} onClick={() => changeFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="lx-grid">
          {shown.map((p) => (
            <li key={p.id} className="lx-card" data-flip-id={p.id}>
              <Link to={`/produit/${p.id}`} className="lx-card__link">
                <span className="lx-card__media">
                  <img src={p.image} alt={p.imageAlt || p.name} loading="lazy" />
                </span>
                <span className="lx-card__name">{p.name}</span>
                <span className="lx-card__meta">{p.gender}, {p.volume}</span>
                <span className="lx-card__price">{p.price.toLocaleString('fr-FR')} FCFA</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/collections" className="lx-btn lx-btn--dark lx-collection__all">Toute la collection</Link>
      </section>

      {/* S6 · FINALE MASTER */}
      <section className="lx-finale">
        <div className="lx-finale__body">
          <Sillage>Master</Sillage>
          {master && (
            <p className="lx-finale__count">
              <span className="lx-finale__num">{master.masterDetails.available}</span>
              <span> flacons disponibles sur {master.masterDetails.total}</span>
            </p>
          )}
          <p className="lx-finale__text">
            Nos éditions numérotées. Chaque flacon porte son numéro, et il n’y en aura pas d’autres.
          </p>
          {master && <Link to={`/produit/${master.id}`} className="lx-btn lx-btn--light">Réserver une pièce</Link>}
        </div>
        <div className="lx-finale__photo">
          <img src={img('photo-1682251008222-412b140cbf4f', 1200)} alt="Main tenant un flacon de parfum transparent" loading="lazy" />
        </div>
      </section>
    </div>
  );
};

export default Home;

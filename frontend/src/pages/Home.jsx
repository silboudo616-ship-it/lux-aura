import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../motion/gsap';
import './Home.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=900';
// Volontairement en basse définition : étirée en plein écran, elle devient floue « gratuitement ».
// (Un filter: blur() CSS sur une image animée faisait chuter le desktop à ~45 fps : flou recalculé à chaque image.)
const MASTER_IMG   = 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=70&w=480';
const STORY_IMG    = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1400';

const LEVELS = [
  { name: 'Standard', range: '1 000 – 10 000 FCFA',  action: 'Commander',          desc: 'Des fragrances accessibles, sans compromis sur la qualité.' },
  { name: 'Premium',  range: '10 000 – 50 000 FCFA', action: 'Réserver',           desc: 'Des compositions élaborées pour les connaisseurs exigeants.' },
  { name: 'Légende',  range: 'Sur demande',          action: 'Réserver',           desc: 'Les créations iconiques de la maison, en quantité limitée.' },
  { name: 'Master',   range: 'Édition numérotée',    action: 'Réserver une pièce', desc: 'Des œuvres uniques, chaque flacon numéroté.' },
];

const Home = () => {
  const pageRef = useRef(null);
  const { products, getCategoryImage } = useProducts();

  const featured      = products.slice(0, 4);
  const masterPerfume = products.find(p => p.collection === 'Master');

  const categoryImages = [
    { label: 'Hommes', img: getCategoryImage('Hommes') || FALLBACK_IMG },
    { label: 'Femmes', img: getCategoryImage('Femmes') || FALLBACK_IMG },
    { label: 'Mixte',  img: getCategoryImage('Mixte')  || FALLBACK_IMG },
  ];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(pageRef);

    /* Titres de section : lignes qui montent derrière un masque. */
    q('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'split-mask', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110, stagger: 0.12, duration: 1.3,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }),
      });
    });

    /* Manifeste : les mots s'allument au rythme du scroll (scrub). */
    q('.lux-text').forEach((el) => {
      const split = SplitText.create(el, { type: 'words' });
      gsap.from(split.words, {
        opacity: 0.12, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    });
    gsap.from(q('.lux-divider'), { scaleX: 0, duration: 1.4, scrollTrigger: { trigger: q('.lux-divider')[0], start: 'top 85%' } });
    gsap.from(q('.lux-highlight-box, .lux-signature'), {
      autoAlpha: 0, y: 30, stagger: 0.15, scrollTrigger: { trigger: q('.lux-highlight-box')[0], start: 'top 85%' },
    });

    /* Catégories : rideau doré qui se lève + image qui dézoome. */
    q('.home__cat-item').forEach((item, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 80%' }, delay: i * 0.12 });
      tl.to(item.querySelector('.home__cat-curtain'), { scaleY: 0, duration: 1.3, ease: 'expo.inOut' })
        .from(item.querySelector('.home__cat-img-wrap'), { scale: 1.35, duration: 1.8 }, 0.2)
        .from(item.querySelector('.home__cat-label'), { autoAlpha: 0, y: 30 }, 0.7);
    });

    /* Niveaux : la ligne se trace, puis les cartes montent une à une. */
    gsap.from(q('.home__levels-grid'), {
      '--line': 0, duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: q('.home__levels-grid')[0], start: 'top 85%' },
    });
    gsap.from(q('.home__level-item'), {
      y: 60, autoAlpha: 0, stagger: 0.12,
      scrollTrigger: { trigger: q('.home__levels-grid')[0], start: 'top 80%' },
    });

    /* Produits : grille qui monte en décalé. */
    gsap.from(q('.home__product-cell'), {
      y: 80, stagger: 0.12, duration: 1.4,
      scrollTrigger: { trigger: q('.home__product-grid')[0], start: 'top 85%' },
    });

    /* Master : section épinglée (desktop) — fond qui dézoome, compteur qui défile. */
    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
      const master = q('.home__master')[0];
      if (!master) return;
      const num = master.querySelector('.home__master-num');
      const total = Number(master.dataset.total) || 0;
      const available = Number(master.dataset.available) || 0;
      const counter = { value: total };

      const tl = gsap.timeline({
        scrollTrigger: ctx.conditions.desktop
          ? { trigger: master, start: 'top top', end: '+=120%', scrub: 1, pin: true }
          : { trigger: master, start: 'top 75%', end: 'bottom 60%', scrub: 1 },
      });
      // Durées relatives : la timeline "scrubée" est étirée sur toute la distance de scroll.
      tl.fromTo(master.querySelector('.home__master-img'), { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .from(master.querySelectorAll('.home__master-reveal'), { autoAlpha: 0, y: 50, stagger: 0.05, duration: 0.3, ease: 'power2.out' }, 0)
        .to(counter, {
          value: available, ease: 'power1.inOut', duration: 0.7,
          onUpdate: () => { num.textContent = Math.round(counter.value); },
        }, 0.2);
    });

    /* Storytelling : l'image glisse plus lentement que la page (parallax). */
    gsap.fromTo(q('.home__story-img-side img'), { yPercent: -12 }, {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: q('.home__story')[0], start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from(q('.home__story-text > :not(blockquote)'), {
      autoAlpha: 0, y: 30, stagger: 0.12, scrollTrigger: { trigger: q('.home__story-text')[0], start: 'top 75%' },
    });

    gsap.from(q('.home__newsletter-inner > *'), {
      autoAlpha: 0, y: 30, stagger: 0.1, scrollTrigger: { trigger: q('.home__newsletter')[0], start: 'top 80%' },
    });
  }, { scope: pageRef, dependencies: [products.length] , revertOnUpdate: true });

  return (
    <div ref={pageRef} className="home">

      <Hero />

      {/* ── MANIFESTE ── */}
      <section className="lux-aura-intro">
        <div className="lux-aura-intro-inner">
          <p className="home__intro-eyebrow t-label">Maison Lux Aura</p>
          <h2 className="lux-title" data-split>L'élégance et le charme, à portée de tous.</h2>

          <div className="lux-divider" />

          <p className="lux-text">
            Des fragrances soigneusement sélectionnées, pensées pour celles et ceux qui aiment
            le luxe, l'élégance, et souhaitent affirmer leur charme en public comme en privé.
          </p>

          <p className="lux-text">
            Chaque parfum dégage une aura puissante et éclatante — une présence qui se remarque,
            qui séduit, qui reste.
          </p>

          <div className="lux-highlight-box">
            <p className="lux-highlight">
              Une collection <strong>exceptionnelle.</strong> Des prix <strong>accessibles.</strong>
            </p>
          </div>

          <p className="lux-signature"><em>Lux Aura — Sentez la différence.</em></p>
        </div>
      </section>

      <Marquee />

      {/* ── GENRES ── */}
      <section className="home__categories" aria-label="Catégories">
        <div className="home__cat-grid">
          {categoryImages.map((cat) => (
            <Link
              key={cat.label}
              to={`/collections?gender=${cat.label}`}
              className="home__cat-item"
              aria-label={`Collection ${cat.label}`}
              data-cursor="Explorer"
            >
              <div className="home__cat-img-wrap">
                <img src={cat.img} alt={`Collection ${cat.label}`} className="home__cat-img" loading="lazy" />
                <div className="home__cat-overlay" />
              </div>
              <span className="home__cat-curtain" aria-hidden="true" />
              <div className="home__cat-label">
                <span className="home__cat-name">{cat.label}</span>
                <span className="home__cat-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NIVEAUX DE COLLECTION ── */}
      <section className="home__levels container">
        <div className="home__levels-header">
          <p className="t-label" style={{ color: 'var(--gold)' }}>Quatre niveaux d'exception</p>
          <h2 className="t-heading" style={{ marginTop: '1rem' }} data-split>Nos Collections</h2>
        </div>
        <div className="home__levels-grid">
          {LEVELS.map((col, i) => (
            <div key={col.name} className={`home__level-item ${col.name === 'Master' ? 'home__level-item--master' : ''}`}>
              <p className="home__level-index">0{i + 1}</p>
              <h3 className="home__level-name">{col.name}</h3>
              <p className="home__level-range">{col.range}</p>
              <p className="home__level-desc t-body">{col.desc}</p>
              <Link to={`/collections?level=${col.name}`} className="home__level-cta">
                {col.action} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── SÉLECTION PRODUITS ── */}
      <section className="home__products container">
        <div className="home__products-header">
          <h2 className="t-heading" data-split>Nos Créations</h2>
          <Link to="/collections" className="home__products-all t-label">Voir tout →</Link>
        </div>
        <div className="home__product-grid">
          {featured.map((p, i) => (
            <div key={p.id} className={`home__product-cell home__product-cell--${i === 0 ? 'large' : 'normal'}`}>
              <ProductCard perfume={p} size={i === 0 ? 'large' : 'normal'} />
            </div>
          ))}
        </div>
      </section>

      {/* ── MASTER COLLECTION ── */}
      {masterPerfume && (
        <section
          className="home__master"
          aria-label="Master Collection"
          data-total={masterPerfume.masterDetails?.total ?? 0}
          data-available={masterPerfume.masterDetails?.available ?? 0}
        >
          <div className="home__master-bg">
            <img src={MASTER_IMG} alt="" aria-hidden="true" className="home__master-img" loading="lazy" />
            <div className="home__master-overlay" />
          </div>
          <div className="home__master-content container">
            <p className="t-label home__master-reveal" style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Collection Exclusive · Pièces restantes
            </p>
            <div className="home__master-counter home__master-reveal">
              <span className="home__master-num">{masterPerfume.masterDetails?.available ?? '—'}</span>
              <span className="home__master-total"> / {masterPerfume.masterDetails?.total ?? '—'}</span>
            </div>
            <h2 className="home__master-title home__master-reveal">
              Une fragrance<br />
              <em>pour ceux qui recherchent<br />l'exception.</em>
            </h2>
            <p className="home__master-name home__master-reveal">{masterPerfume.name}</p>
            <Link
              to={`/produit/${masterPerfume.id}`}
              className="btn btn--gold home__master-reveal"
              style={{ marginTop: '3rem' }}
              data-cursor="Voir"
            >
              Découvrir la Pièce →
            </Link>
          </div>
        </section>
      )}

      {/* ── STORYTELLING ── */}
      <section className="home__story">
        <div className="home__story-img-side">
          <img src={STORY_IMG} alt="Flacon de parfum entouré de roses" loading="lazy" />
        </div>
        <div className="home__story-text container">
          <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '2rem' }}>Notre Philosophie</p>
          <blockquote className="home__story-quote" data-split>
            « Le parfum n'est pas un accessoire. <em>C'est une signature.</em> »
          </blockquote>
          <p className="t-body" style={{ marginTop: '2rem', maxWidth: '44ch' }}>
            Fondée sur la conviction que la rareté est la plus grande des élégances,
            LUX AURA sélectionne les matières premières les plus précieuses pour
            créer des fragrances qui transcendent le temps.
          </p>
          <Link to="/collections" className="btn" style={{ marginTop: '3rem', alignSelf: 'flex-start' }}>
            Découvrir la Maison
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="home__newsletter container">
        <div className="home__newsletter-inner">
          <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Lettre de la Maison</p>
          <h2 className="t-heading" style={{ marginBottom: '1rem' }}>Recevez nos nouvelles</h2>
          <p className="t-body" style={{ marginBottom: '2.5rem', maxWidth: '42ch', marginInline: 'auto' }}>
            Soyez informé en avant-première de nos nouvelles créations, éditions limitées et événements exclusifs.
          </p>
          <form
            className="home__newsletter-form"
            onSubmit={(e) => { e.preventDefault(); alert('Vous êtes maintenant inscrit à la lettre de la maison LUX AURA.'); e.target.reset(); }}
          >
            <input type="email" required placeholder="Votre adresse e-mail" className="home__newsletter-input" aria-label="Adresse e-mail" />
            <button type="submit" className="btn btn--filled">S'abonner</button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;

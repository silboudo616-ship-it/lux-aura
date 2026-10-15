import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import './Home.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=800';

/* Helper: trigger reveal animations */
const useReveal = (ref) => {
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal') || [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
};

const Home = () => {
  const pageRef = useRef(null);
  useReveal(pageRef);
  const { products, getCategoryImage } = useProducts();

  const featured     = products.slice(0, 4);
  const masterPerfume = products.find(p => p.collection === 'Master');

  const categoryImages = [
    { label: 'Hommes', img: getCategoryImage('Hommes') || FALLBACK_IMG },
    { label: 'Femmes', img: getCategoryImage('Femmes') || FALLBACK_IMG },
    { label: 'Mixte',  img: getCategoryImage('Mixte')  || FALLBACK_IMG },
  ];

  return (
    <div ref={pageRef} className="home">

      {/* ── HERO ── */}
      <Hero />

      {/* ── SECTION PRÉSENTATION LUX AURA ── */}
      <section className="lux-aura-intro reveal">
        <div className="lux-aura-intro-inner">
          <p className="home__intro-eyebrow t-label">Maison Lux Aura</p>
          <h2 className="lux-title">✨ Lux Aura — L'élégance et le charme à portée de tous</h2>

          <div className="lux-divider" />

          <p className="lux-text">
            Des fragrances soigneusement sélectionnées, pensées pour celles et ceux qui aiment 
            le luxe, l'élégance, et souhaitent affirmer leur charme en public comme en privé.
          </p>

          <p className="lux-text">
            Chaque parfum dégage une <strong>aura puissante et éclatante</strong> — 
            une présence qui se remarque, qui séduit, qui reste.
          </p>

          <div className="lux-highlight-box">
            <p className="lux-highlight">
              Une collection <strong>exceptionnelle. Des prix accessibles.</strong>
            </p>
          </div>

          <p className="lux-signature"><em>Lux Aura — Sentez la différence. 🌸</em></p>
        </div>
      </section>

      {/* ── GENDER CATEGORIES ── */}
      <section className="home__categories" aria-label="Catégories">
        <div className="home__cat-grid">
          {categoryImages.map((cat) => (
            <Link
              key={cat.label}
              to={`/collections?gender=${cat.label}`}
              className="home__cat-item reveal"
              aria-label={`Collection ${cat.label}`}
            >
              <div className="home__cat-img-wrap">
                <img src={cat.img} alt={`Collection ${cat.label}`} className="home__cat-img" loading="lazy" />
                <div className="home__cat-overlay" />
              </div>
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
        <div className="home__levels-header reveal">
          <p className="t-label" style={{ color: 'var(--gold)' }}>Quatre niveaux d'exception</p>
          <h2 className="t-heading" style={{ marginTop: '1rem' }}>Nos Collections</h2>
        </div>
        <div className="home__levels-grid">
          {[
            { name: 'Standard',  range: '1 000 – 10 000 FCFA',  action: 'Commander',          desc: 'Des fragrances accessibles, sans compromis sur la qualité.' },
            { name: 'Premium',   range: '10 000 – 50 000 FCFA', action: 'Réserver',           desc: 'Des compositions élaborées pour les connaisseurs exigeants.' },
            { name: 'Légende',   range: 'Sur demande',           action: 'Réserver',           desc: 'Les créations iconiques de la maison, en quantité limitée.' },
            { name: 'Master',    range: 'Édition numérotée',     action: 'Réserver une pièce', desc: 'Des œuvres uniques, chaque flacon numéroté parmi 300.' },
          ].map((col, i) => (
            <div key={col.name} className={`home__level-item reveal reveal-delay-${i + 1}`}>
              <p className="t-label" style={{ color: col.name === 'Master' ? 'var(--gold)' : 'var(--grey)' }}>0{i + 1}</p>
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
        <div className="home__products-header reveal">
          <h2 className="t-heading">Nos Créations</h2>
          <Link to="/collections" className="home__products-all t-label" style={{ color: 'var(--grey)' }}>
            Voir tout →
          </Link>
        </div>

        {/* Editorial asymmetric grid */}
        <div className="home__product-grid">
          {featured.map((p, i) => (
            <div key={p.id} className={`home__product-cell home__product-cell--${i === 0 ? 'large' : 'normal'}`}>
              <ProductCard perfume={p} size={i === 0 ? 'large' : 'normal'} />
            </div>
          ))}
        </div>
      </section>

      {/* ── MASTER COLLECTION CTA ── */}
      {masterPerfume && (
        <section className="home__master" aria-label="Master Collection">
          <div className="home__master-bg">
            <img
              src="https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=85&w=2400"
              alt=""
              aria-hidden="true"
              className="home__master-img"
              loading="lazy"
            />
            <div className="home__master-overlay" />
          </div>
          <div className="home__master-content container reveal">
            <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Collection Exclusive</p>
            <div className="home__master-counter">
              <span className="home__master-num">{masterPerfume.masterDetails?.available ?? '—'}</span>
              <span className="home__master-total"> / {masterPerfume.masterDetails?.total ?? '—'}</span>
            </div>
            <h2 className="home__master-title">
              Une fragrance<br />
              <em>pour ceux qui recherchent<br />l'exception.</em>
            </h2>
            <p className="home__master-name">{masterPerfume.name}</p>
            <Link to={`/produit/${masterPerfume.id}`} className="btn btn--gold" style={{ marginTop: '3rem' }}>
              Découvrir la Pièce →
            </Link>
          </div>
        </section>
      )}

      {/* ── STORYTELLING ── */}
      <section className="home__story">
        <div className="home__story-img-side">
          <img
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200"
            alt="Savoir-faire LUX AURA"
            loading="lazy"
          />
        </div>
        <div className="home__story-text container reveal">
          <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '2rem' }}>Notre Philosophie</p>
          <blockquote className="home__story-quote">
            "Le parfum n'est pas un accessoire.<br />
            <em>C'est une signature."</em>
          </blockquote>
          <p className="t-body" style={{ marginTop: '2rem', maxWidth: '44ch' }}>
            Fondée sur la conviction que la rareté est la plus grande des élégances,
            LUX AURA sélectionne les matières premières les plus précieuses pour
            créer des fragrances qui transcendent le temps.
          </p>
          <Link to="/collections" className="btn" style={{ marginTop: '3rem' }}>
            Découvrir la Maison
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="home__newsletter container">
        <div className="home__newsletter-inner reveal">
          <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Lettre de la Maison</p>
          <h2 className="t-heading" style={{ marginBottom: '1rem' }}>Recevez nos nouvelles</h2>
          <p className="t-body" style={{ marginBottom: '2.5rem', maxWidth: '42ch', marginInline: 'auto' }}>
            Soyez informé en avant-première de nos nouvelles créations, éditions limitées et événements exclusifs.
          </p>
          <form
            className="home__newsletter-form"
            onSubmit={(e) => { e.preventDefault(); alert('Vous êtes maintenant inscrit à la lettre de la maison LUX AURA.'); e.target.reset(); }}
          >
            <input
              type="email"
              required
              placeholder="Votre adresse e-mail"
              className="home__newsletter-input"
              aria-label="Adresse e-mail"
            />
            <button type="submit" className="btn btn--filled">S'abonner</button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;

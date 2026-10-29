import { Link } from 'react-router-dom';
import './PerfumeCard.css';

const tagFor = (p) => {
  if (p.collection === 'Master' && p.masterDetails) {
    return `Master, ${p.masterDetails.available} sur ${p.masterDetails.total}`;
  }
  return p.collection === 'Standard' ? null : p.collection;
};

/* Carte parfum partagée. data-flip-id permet à GSAP Flip de suivre la carte quand la grille change. */
export default function PerfumeCard({ perfume: p }) {
  const tag = tagFor(p);
  return (
    <li className="lx-card" data-flip-id={p.id}>
      <Link to={`/produit/${p.id}`} className="lx-card__link">
        <span className="lx-card__media">
          <img src={p.image} alt={p.imageAlt || p.name} loading="lazy" />
          {tag && <span className="lx-card__tag">{tag}</span>}
        </span>
        <span className="lx-card__name">{p.name}</span>
        <span className="lx-card__meta">{p.gender}, {p.volume}</span>
        <span className="lx-card__price">{p.price.toLocaleString('fr-FR')} FCFA</span>
      </Link>
    </li>
  );
}

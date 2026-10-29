import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../motion/gsap';
import Sillage from '../home/Sillage';
import './Footer.css';

const LINKS = [
  { title: 'Parfums', items: [
    ['Homme', '/collections?gender=Hommes'], ['Femme', '/collections?gender=Femmes'],
    ['Mixte', '/collections?gender=Mixte'], ['Tous les parfums', '/collections'],
  ] },
  { title: 'Collections', items: [
    ['Standard', '/collections?level=Standard'], ['Premium', '/collections?level=Premium'],
    ['Légende', '/collections?level=L%C3%A9gende'], ['Master', '/collections?level=Master'],
  ] },
  { title: 'Votre compte', items: [['Se connecter', '/connexion'], ['Mes commandes', '/compte']] },
];

const Footer = () => {
  const root = useRef(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  /* Le nom de la maison monte lettre par lettre à mesure que l'on arrive en bas de page. */
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const mark = q('.ft-mark')[0];
    const split = SplitText.create(mark.querySelector('.sillage__text'), { type: 'chars', mask: 'chars', charsClass: 'sl-char' });
    mark.querySelectorAll('.sillage__echo').forEach((e) => SplitText.create(e, { type: 'chars', charsClass: 'sl-char' }));
    gsap.timeline({
      scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    })
      .from(split.chars, { yPercent: 105, stagger: 0.06, ease: 'power3.out' })
      .from(mark.querySelectorAll('.sillage__echo'), { yPercent: -40, autoAlpha: 0, ease: 'none' }, 0.2);
    gsap.from(q('.ft-news > *, .ft-col'), {
      autoAlpha: 0, y: 30, stagger: 0.08, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 85%' },
    });
  }, { scope: root });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setEmail('');
  };

  return (
    <footer className="ft" ref={root}>
      <div className="ft-top">
        <div className="ft-news">
          <h2 className="ft-news__title">Les nouveaux parfums, avant tout le monde.</h2>
          {sent ? (
            <p className="ft-news__done" role="status">Inscription enregistrée. La prochaine lettre arrivera dans votre boîte.</p>
          ) : (
            <form className="ft-news__form" onSubmit={submit}>
              <label className="ft-news__label" htmlFor="ft-email">Votre adresse e-mail</label>
              <input
                id="ft-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="ft-news__input"
                autoComplete="email"
              />
              <button type="submit" className="ft-news__btn">S’inscrire</button>
            </form>
          )}
        </div>

        <nav className="ft-cols" aria-label="Pied de page">
          {LINKS.map((col) => (
            <div className="ft-col" key={col.title}>
              <h3 className="ft-col__title">{col.title}</h3>
              <ul>
                {col.items.map(([label, to]) => (
                  <li key={label}><Link to={to} className="ft-link">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <Sillage as="p" className="ft-mark" aria-hidden="true">LUX AURA</Sillage>

      <div className="ft-bottom">
        <span>© {new Date().getFullYear()} LUX AURA</span>
        <span>Maison de parfums</span>
      </div>
    </footer>
  );
};

export default Footer;

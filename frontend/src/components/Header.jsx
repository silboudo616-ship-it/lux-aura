import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 60);
    setHidden(y > 400 && y > lastY.current);
    lastY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const isHome = location.pathname === '/';

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''} ${hidden && !menuOpen ? 'header--hidden' : ''} ${isHome && !scrolled ? 'header--transparent' : ''}`}>
        <div className="header__inner">

          {/* LEFT — LOGO */}
          <Link to="/" className="header__logo" aria-label="LUX AURA Accueil">
            <img 
              src={`${import.meta.env.BASE_URL}logo.jpg`} 
              alt="LUX AURA Logo" 
              className="header__logo-img" 
            />
            <span className="header__logo-text">
              <span className="header__logo-lux">LUX</span>
              <span className="header__logo-sep"> </span>
              <span className="header__logo-parfum">AURA</span>
            </span>
          </Link>

          {/* CENTER — NAV */}
          <nav className="header__nav" aria-label="Navigation principale">
            <Link to="/collections?gender=Hommes" className="header__nav-link">Hommes</Link>
            <Link to="/collections?gender=Femmes" className="header__nav-link">Femmes</Link>
            <Link to="/collections?gender=Mixte"  className="header__nav-link">Mixte</Link>
            <Link to="/collections"               className="header__nav-link">Collections</Link>
            <Link to="/collections?level=Master"  className="header__nav-link header__nav-link--gold">Master</Link>
          </nav>

          {/* RIGHT — ACTIONS */}
          <div className="header__actions">
            <Link to="/admin" className="header__action-link" aria-label="Administration" style={{ color: 'var(--gold)' }}>Admin</Link>
            <Link to="/connexion" className="header__action-link" aria-label="Mon compte">Compte</Link>
            <button
              className="header__action-link header__action-cart"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Panier (${cartCount} articles)`}
            >
              Panier{cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
            </button>
            {/* Mobile burger */}
            <button
              className="header__burger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span className={`header__burger-bar ${menuOpen ? 'open' : ''}`} />
              <span className={`header__burger-bar ${menuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mobile-menu__nav">
          <Link to="/"                            className="mobile-menu__link">Accueil</Link>
          <Link to="/collections?gender=Hommes"  className="mobile-menu__link">Hommes</Link>
          <Link to="/collections?gender=Femmes"  className="mobile-menu__link">Femmes</Link>
          <Link to="/collections?gender=Mixte"   className="mobile-menu__link">Mixte</Link>
          <Link to="/collections"                className="mobile-menu__link">Collections</Link>
          <Link to="/collections?level=Master"   className="mobile-menu__link mobile-menu__link--gold">Master Collection</Link>
          <Link to="/connexion"                  className="mobile-menu__link">Mon Compte</Link>
          <Link to="/admin"                      className="mobile-menu__link" style={{ color: 'var(--gold)' }}>Admin</Link>
        </nav>
        <p className="mobile-menu__tagline">L'art subtil de l'exception.</p>
      </div>
    </>
  );
};

export default Header;

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? 'cart-overlay--open' : ''}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}
        aria-label="Votre panier"
        role="dialog"
        data-lenis-prevent
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="cart-drawer__header">
          <div>
            <h2 className="cart-drawer__title">Votre Sélection</h2>
            {cartItems.length > 0 && (
              <p className="cart-drawer__count t-label">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</p>
            )}
          </div>
          <button className="cart-drawer__close" onClick={() => setIsCartOpen(false)} aria-label="Fermer le panier">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* DIVIDER */}
        <div style={{ height: '1px', background: 'var(--grey-lt)' }} />

        {/* CONTENT */}
        <div className="cart-drawer__body">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <p className="cart-drawer__empty-title">Votre panier est vide.</p>
              <p className="cart-drawer__empty-sub">Explorez nos fragrances d'exception.</p>
              <button className="btn" style={{ marginTop: '2rem' }} onClick={() => setIsCartOpen(false)}>
                Découvrir nos parfums
              </button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__img-wrap">
                    <img
                      src={item.image}
                      alt={item.imageAlt || item.name}
                      className="cart-item__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="cart-item__info">
                    <p className="t-label" style={{ color: 'var(--gold)' }}>{item.collection}</p>
                    <h4 className="cart-item__name">{item.name}</h4>
                    <p className="cart-item__vol">{item.volume}</p>
                    <div className="cart-item__row">
                      <div className="cart-item__qty">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuer">−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Augmenter">+</button>
                      </div>
                      <span className="t-price">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label={`Retirer ${item.name}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span className="t-label">Total estimé</span>
              <span className="cart-drawer__total-amount">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <button className="btn btn--filled" style={{ width: '100%' }} onClick={() => alert('Paiement — disponible après connexion au backend')}>
              Valider la commande
            </button>
            <button className="cart-drawer__clear" onClick={clearCart}>Vider le panier</button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;

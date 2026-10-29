import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';
import { useCart } from '../context/CartContext';

/* Défilement fluide Lenis, synchronisé avec ScrollTrigger
   (intégration officielle du README Lenis : même boucle que le ticker GSAP). */
const SmoothScroll = () => {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();
  const { isCartOpen } = useCart();

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Nouvelle page : retour en haut immédiat, puis recalcul des déclencheurs.
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Panier ouvert : on fige la page derrière.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isCartOpen) lenis.stop();
    else lenis.start();
  }, [isCartOpen]);

  return null;
};

export default SmoothScroll;

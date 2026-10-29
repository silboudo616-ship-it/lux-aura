// Point d'entrée unique de GSAP : les plugins sont enregistrés une seule fois ici.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Courbes de la maison : sortie longue et feutrée.
gsap.defaults({ ease: 'expo.out', duration: 1.2 });

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };

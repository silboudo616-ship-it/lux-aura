// État partagé entre GSAP (qui l'anime au scroll) et la scène 3D (qui le lit à chaque image).
// Un simple objet mutable : pas de re-render React, juste des nombres.
// x et y sont exprimés en fraction de la demi-largeur / demi-hauteur visible (-1 → 1),
// pour que les positions restent justes quel que soit l'écran.
export const bottle = {
  x: 0, y: -0.28, scale: 1,
  rotX: 0.12, rotY: -0.5, rotZ: 0,
  liquid: 0.86,
  pointerX: 0, pointerY: 0,
};

// Positions clés du storyboard.
export const POSES = {
  hero:   { x: 0,     y: -0.3,  scale: 1,    rotX: 0.12,  rotY: -0.5, rotZ: 0,     liquid: 0.86 },
  reveal: { x: 0.5,   y: -0.05, scale: 0.95, rotX: -0.35, rotY: 1.1,  rotZ: -0.5,  liquid: 0.88 },
  angle:  { x: -0.52, y: 0.02,  scale: 1,    rotX: 1.05,  rotY: 2.6,  rotZ: 0.35,  liquid: 0.94 },
  trace:  { x: 0.02,  y: -0.08, scale: 1.2,  rotX: -0.2,  rotY: 6.1,  rotZ: -0.15, liquid: 0.94 },
  inside: { x: 0.5,   y: -0.05, scale: 1.05, rotX: 0.06,  rotY: 6.9,  rotZ: 0.1,   liquid: 0.94 },
};

// Sur mobile (écran étroit), le flacon reste centré et monte/descend au lieu d'aller à gauche/droite.
export const POSES_MOBILE = {
  hero:   { ...POSES.hero,   y: -0.12, scale: 0.72 },
  reveal: { ...POSES.reveal, x: 0.1,   y: -0.45, scale: 0.62 },
  angle:  { ...POSES.angle,  x: -0.1,  y: -0.45, scale: 0.62 },
  trace:  { ...POSES.trace,  x: 0,     y: -0.42, scale: 0.7 },
  inside: { ...POSES.inside, x: 0,     y: 0.45,  scale: 0.7 },
};

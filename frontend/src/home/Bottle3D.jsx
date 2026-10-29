import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { bottle } from './bottleState';

/* Reflets : un "studio" généré localement (aucun fichier HDR à télécharger). */
function StudioLight() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => { env.dispose(); pmrem.dispose(); scene.environment = null; };
  }, [gl, scene]);
  return null;
}

/* Gravure "LUX AURA" dessinée une fois dans un canvas 2D, posée sur le verre. */
function useEngravingTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const draw = () => {
      const g = c.getContext('2d');
      g.clearRect(0, 0, c.width, c.height);
      g.fillStyle = '#ffffff';
      g.textAlign = 'center';
      // Jost (traits réguliers) : les déliés très fins de la Bodoni disparaissent une fois réduits sur le verre.
      g.letterSpacing = '24px';
      g.font = '500 150px "Jost", sans-serif';
      g.fillText('LUX', 524, 245);
      g.letterSpacing = '30px';
      g.font = '400 60px "Jost", sans-serif';
      g.fillText('AURA', 530, 345);
      g.fillRect(402, 388, 220, 3);
      tex.needsUpdate = true;
    };
    draw();
    // On redessine quand les polices web sont prêtes.
    document.fonts?.ready.then(draw);
    return tex;
  }, []);
}

function Flacon() {
  const group = useRef();
  const liquid = useRef();
  const engraving = useEngravingTexture();

  const geo = useMemo(() => ({
    // Verre épais : le jus remplit presque tout, avec un fond de verre plus marqué en bas.
    glass: new RoundedBoxGeometry(1.36, 1.84, 0.74, 6, 0.16),
    juice: new RoundedBoxGeometry(1.2, 1.58, 0.58, 4, 0.1),
    collar: new THREE.CylinderGeometry(0.17, 0.2, 0.16, 32),
    // Bouchon : bloc laqué légèrement évasé (tronc de pyramide à base carrée), plus fin que le corps.
    cap: new THREE.CylinderGeometry(0.4, 0.34, 0.66, 4, 1),
    plate: new THREE.PlaneGeometry(1, 0.5),
  }), []);

  const mat = useMemo(() => ({
    // Verre : transparence + reflets d'environnement (pas de "transmission", qui ne verrait pas
    // la page HTML derrière le canvas et coûterait une passe de rendu supplémentaire).
    glass: new THREE.MeshPhysicalMaterial({
      color: '#ffffff', roughness: 0.04, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03,
      envMapIntensity: 2.6, transparent: true, opacity: 0.16, depthWrite: false,
    }),
    juice: new THREE.MeshPhysicalMaterial({
      color: '#0c5238', roughness: 0.1, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06,
      envMapIntensity: 1.3, transparent: true, opacity: 0.9,
    }),
    black: new THREE.MeshPhysicalMaterial({
      color: '#050505', roughness: 0.18, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08,
    }),
    engraving: new THREE.MeshBasicMaterial({ map: engraving, transparent: true, opacity: 0.92, depthWrite: false }),
  }), [engraving]);

  useEffect(() => () => {
    Object.values(geo).forEach((g) => g.dispose());
    Object.values(mat).forEach((m) => m.dispose());
    engraving.dispose();
  }, [geo, mat, engraving]);

  // Chaque image : on rejoint en douceur l'état piloté par le scroll (amorti = sensation de poids).
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { width, height } = state.viewport;
    // Taille de base : le flacon (≈2,6 unités de haut) occupe ~55 % de la hauteur, sans déborder en largeur.
    const base = Math.min(height * 0.55 / 2.6, width * 0.62 / 1.5);
    const k = 1 - Math.pow(0.0015, dt); // lissage indépendant du framerate : donne du poids
    g.position.x += ((bottle.x * width) / 2 - g.position.x) * k;
    g.position.y += ((bottle.y * height) / 2 - g.position.y) * k;
    const s = g.scale.x + (bottle.scale * base - g.scale.x) * k;
    g.scale.setScalar(s);
    g.rotation.x += (bottle.rotX + bottle.pointerY * 0.18 - g.rotation.x) * k;
    g.rotation.y += (bottle.rotY + bottle.pointerX * 0.35 - g.rotation.y) * k;
    g.rotation.z += (bottle.rotZ - g.rotation.z) * k;
    if (liquid.current) {
      const h = Math.max(0.05, bottle.liquid);
      liquid.current.scale.y = h;
      liquid.current.position.y = 0.06 - 0.79 * (1 - h);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={liquid} geometry={geo.juice} material={mat.juice} renderOrder={1} />
      <mesh geometry={geo.glass} material={mat.glass} renderOrder={2} />
      <mesh geometry={geo.plate} material={mat.engraving} position={[0, 0, 0.375]} renderOrder={3} />
      <mesh geometry={geo.collar} material={mat.black} position={[0, 1.0, 0]} />
      <mesh geometry={geo.cap} material={mat.black} position={[0, 1.41, 0]} rotation={[0, Math.PI / 4, 0]} />
    </group>
  );
}

export default function Bottle3D({ active = true }) {
  return (
    <Canvas
      className="bottle-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.25]} // plafonné : le canvas couvre tout l'écran, chaque pixel compte
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7.5], fov: 32 }}
    >
      <StudioLight />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, 1, -3]} intensity={0.8} color="#cfe8d9" />
      <Flacon />
    </Canvas>
  );
}

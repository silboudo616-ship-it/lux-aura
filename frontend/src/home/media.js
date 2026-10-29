// Visuels partagés (Unsplash, licence gratuite usage commercial) et textes par univers.
export const img = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;

export const GENRES = [
  { key: 'Hommes', label: 'Homme', line: 'Boisés, épicés, ambrés.', photo: 'photo-1702065613116-620168beb732', focus: '22% 40%' },
  { key: 'Femmes', label: 'Femme', line: 'Floraux, vanillés, lumineux.', photo: 'photo-1623538244675-b97056120ab1' },
  { key: 'Mixte',  label: 'Mixte', line: 'Oud, musc, cuir : à partager.', photo: 'photo-1609255836143-3480a093a35b' },
];

export const LEVELS = {
  Standard: 'Des parfums à porter chaque jour, de 1 000 à 10 000 FCFA.',
  Premium:  'Des compositions plus rares, de 10 000 à 50 000 FCFA, sur réservation.',
  'Légende': 'Les créations iconiques de la maison, en quantité limitée.',
  Master:   'Nos éditions numérotées : chaque flacon porte son numéro.',
};

export const DEFAULT_PHOTO = 'photo-1682251008222-412b140cbf4f';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import {
  LayoutDashboard, Package, Settings, LogOut, ExternalLink, Plus, Search, Pencil, Trash2, Copy, Eye,
  TriangleAlert, Menu, X, ImageOff, LayoutGrid, List, RotateCcw, Save, ArrowLeft, Upload, Link2, Check,
} from 'lucide-react';
import './Admin.css';

/* ═══════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════ */
const LoginScreen = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onLogin(pin)) {
      setError('Code incorrect');
      setPin('');
    }
  };

  return (
    <div className="admin__login">
      <form className="admin__login-card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="LUX AURA" style={{ width: '56px', height: '56px', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.45)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} />
          <p className="admin__login-logo">LUX AURA</p>
        </div>
        <h1 className="admin__login-title">Administration</h1>
        {error && <p className="admin__login-error">{error}</p>}
        <input
          className="admin__login-input"
          type="password"
          maxLength={6}
          placeholder="• • • •"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(''); }}
          autoFocus
        />
        <button className="admin__btn admin__btn--primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
          Accéder à l’administration
        </button>
      </form>
    </div>
  );
};

/* ═══════════════════════════════════════════
   IMAGE UPLOADER
═══════════════════════════════════════════ */
const ImageUploader = ({ value, onChange }) => {
  const [useUrl, setUseUrl] = useState(!value || value.startsWith('http'));
  const [imgError, setImgError] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image trop volumineuse (max 5 Mo)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target.result);
      setImgError(false);
    };
    reader.readAsDataURL(file);
  };

  if (value && !imgError) {
    return (
      <div>
        <div className="admin__img-upload admin__img-upload--has-image">
          <div className="admin__img-preview-wrap">
            <img
              src={value}
              alt="Aperçu"
              className="admin__img-preview"
              onError={() => setImgError(true)}
            />
            <button
              type="button"
              className="admin__img-preview-remove"
              onClick={() => { onChange(''); setImgError(false); }}
              title="Supprimer l'image"
            ><X size={16} /></button>
          </div>
        </div>
        <button type="button" className="admin__img-url-toggle" onClick={() => { setUseUrl(!useUrl); }}>
          {useUrl ? <><Upload size={15} aria-hidden="true" /> Importer un fichier</> : <><Link2 size={15} aria-hidden="true" /> Utiliser une URL</>}
        </button>
      </div>
    );
  }

  return (
    <div>
      {useUrl ? (
        <div className="admin__form-group">
          <input
            className="admin__form-input"
            placeholder="https://example.com/image.jpg"
            value={value || ''}
            onChange={e => { onChange(e.target.value); setImgError(false); }}
          />
        </div>
      ) : (
        <div className="admin__img-upload" onClick={() => fileRef.current?.click()}>
          <div className="admin__img-upload-icon"><Upload size={26} aria-hidden="true" /></div>
          <p className="admin__img-upload-text">Cliquez ou glissez une image</p>
          <p className="admin__img-upload-hint">JPG, PNG, WebP — max 5 Mo</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
        </div>
      )}
      <button type="button" className="admin__img-url-toggle" onClick={() => setUseUrl(!useUrl)}>
        {useUrl ? <><Upload size={15} aria-hidden="true" /> Importer un fichier</> : <><Link2 size={15} aria-hidden="true" /> Utiliser une URL</>}
      </button>
      {imgError && <p className="admin__form-error">Image inaccessible. Vérifiez le lien.</p>}
    </div>
  );
};

/* ═══════════════════════════════════════════
   PRODUCT FORM (full-page)
═══════════════════════════════════════════ */
const ProductForm = ({ product, onSave, onCancel, collections, genders }) => {
  const [form, setForm] = useState({
    name: '',
    collection: 'Standard',
    gender: 'Mixte',
    price: '',
    volume: '50ml',
    origin: '',
    olfactoryFamily: '',
    notes: '',
    availability: 'Disponible',
    image: '',
    imageAlt: '',
    description: '',
    duration: '',
    type: 'Eau de Parfum',
    masterAvailable: '50',
    masterTotal: '100',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        collection: product.collection || 'Standard',
        gender: product.gender || 'Mixte',
        price: product.price ? String(product.price) : '',
        volume: product.volume || '50ml',
        origin: product.origin || '',
        olfactoryFamily: product.olfactoryFamily || '',
        notes: product.notes || '',
        availability: product.availability || 'Disponible',
        image: product.image || '',
        imageAlt: product.imageAlt || '',
        description: product.description || '',
        duration: product.duration || '',
        type: product.type || 'Eau de Parfum',
        masterAvailable: product.masterDetails ? String(product.masterDetails.available) : '50',
        masterTotal: product.masterDetails ? String(product.masterDetails.total) : '100',
      });
    }
  }, [product]);

  const set = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nom obligatoire';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Prix invalide';
    if (!form.image.trim()) errs.image = 'Image obligatoire';
    if (!form.description.trim()) errs.description = 'Description obligatoire';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || saving) return;
    setSaving(true);
    const data = {
      name: form.name.trim(),
      collection: form.collection,
      gender: form.gender,
      price: Number(form.price),
      volume: form.volume,
      origin: form.origin.trim(),
      olfactoryFamily: form.olfactoryFamily.trim(),
      notes: form.notes.trim(),
      availability: form.availability,
      image: form.image.trim(),
      imageAlt: form.imageAlt.trim() || `Flacon ${form.name.trim()}`,
      description: form.description.trim(),
      duration: form.duration.trim(),
      type: form.type,
    };
    if (data.collection === 'Master') {
      data.masterDetails = {
        available: Number(form.masterAvailable) || 50,
        total: Number(form.masterTotal) || 100,
      };
    }
    // Simulate slight delay for UX feedback
    setTimeout(() => {
      onSave(data);
      setSaving(false);
    }, 300);
  };

  return (
    <div className="admin__form-page">
      <form onSubmit={handleSubmit}>
        {/* ── Image ── */}
        <div className="admin__form-section">
          <h3 className="admin__form-section-title">Photo du parfum</h3>
          <ImageUploader value={form.image} onChange={(v) => set('image', v)} />
          {errors.image && <p className="admin__form-error" style={{marginTop:'0.5rem'}}>{errors.image}</p>}
        </div>

        {/* ── Informations principales ── */}
        <div className="admin__form-section">
          <h3 className="admin__form-section-title">Informations principales</h3>
          <div className="admin__form-grid">
            <div className="admin__form-group admin__form-group--full">
              <label className="admin__form-label">Nom du parfum <span className="admin__form-required">*</span></label>
              <input className={`admin__form-input ${errors.name ? 'admin__form-input--error' : ''}`}
                value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Tom Ford Noir" />
              {errors.name && <p className="admin__form-error">{errors.name}</p>}
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Prix (FCFA) <span className="admin__form-required">*</span></label>
              <input className={`admin__form-input ${errors.price ? 'admin__form-input--error' : ''}`}
                type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Ex: 15000" />
              {errors.price && <p className="admin__form-error">{errors.price}</p>}
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Genre</label>
              <select className="admin__form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Collection</label>
              <select className="admin__form-select" value={form.collection} onChange={e => set('collection', e.target.value)}>
                {collections.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Disponibilité</label>
              <select className="admin__form-select" value={form.availability} onChange={e => set('availability', e.target.value)}>
                <option value="Disponible">Disponible</option>
                <option value="Sur réservation">Sur réservation</option>
                <option value="Édition limitée">Édition limitée</option>
                <option value="Rupture de stock">Rupture de stock</option>
              </select>
            </div>

            <div className="admin__form-group admin__form-group--full">
              <label className="admin__form-label">Description <span className="admin__form-required">*</span></label>
              <textarea className={`admin__form-textarea ${errors.description ? 'admin__form-input--error' : ''}`}
                value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Décrivez ce parfum de manière élégante..." rows={4} />
              {errors.description && <p className="admin__form-error">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* ── Détails techniques ── */}
        <div className="admin__form-section">
          <h3 className="admin__form-section-title">Détails olfactifs</h3>
          <div className="admin__form-grid">
            <div className="admin__form-group">
              <label className="admin__form-label">Type de parfum</label>
              <select className="admin__form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="Eau de Parfum">Eau de Parfum</option>
                <option value="Eau de Toilette">Eau de Toilette</option>
                <option value="Parfum">Parfum (Extrait)</option>
                <option value="Eau de Cologne">Eau de Cologne</option>
                <option value="Brume">Brume Corporelle</option>
              </select>
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Contenance</label>
              <select className="admin__form-select" value={form.volume} onChange={e => set('volume', e.target.value)}>
                <option value="10ml">10ml</option>
                <option value="30ml">30ml</option>
                <option value="50ml">50ml</option>
                <option value="100ml">100ml</option>
                <option value="200ml">200ml</option>
              </select>
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Famille olfactive</label>
              <input className="admin__form-input" value={form.olfactoryFamily}
                onChange={e => set('olfactoryFamily', e.target.value)} placeholder="Ex: Boisé Épicé" />
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Durée du parfum</label>
              <input className="admin__form-input" value={form.duration}
                onChange={e => set('duration', e.target.value)} placeholder="Ex: 8 à 12 heures" />
            </div>

            <div className="admin__form-group admin__form-group--full">
              <label className="admin__form-label">Notes olfactives</label>
              <input className="admin__form-input" value={form.notes}
                onChange={e => set('notes', e.target.value)} placeholder="Ex: Bergamote, Poivre Noir, Bois de Santal" />
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Origine</label>
              <input className="admin__form-input" value={form.origin}
                onChange={e => set('origin', e.target.value)} placeholder="Ex: Dubaï, Paris..." />
            </div>

            <div className="admin__form-group">
              <label className="admin__form-label">Texte alt de l'image</label>
              <input className="admin__form-input" value={form.imageAlt}
                onChange={e => set('imageAlt', e.target.value)} placeholder="Auto-généré si vide" />
            </div>
          </div>
        </div>

        {/* ── Master details (conditional) ── */}
        {form.collection === 'Master' && (
          <div className="admin__form-section">
            <h3 className="admin__form-section-title">Édition Master</h3>
            <div className="admin__form-grid">
              <div className="admin__form-group">
                <label className="admin__form-label">Pièces disponibles</label>
                <input className="admin__form-input" type="number" min="0"
                  value={form.masterAvailable} onChange={e => set('masterAvailable', e.target.value)} />
              </div>
              <div className="admin__form-group">
                <label className="admin__form-label">Total produit</label>
                <input className="admin__form-input" type="number" min="1"
                  value={form.masterTotal} onChange={e => set('masterTotal', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Submit ── */}
        <div className="admin__form-actions">
          <button type="button" className="admin__btn admin__btn--ghost" onClick={onCancel}>Annuler</button>
          <button type="submit" className="admin__btn admin__btn--primary" disabled={saving}>
            {saving ? 'Enregistrement…' : (product ? 'Enregistrer les modifications' : 'Créer le parfum')}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ═══════════════════════════════════════════
   OUTILS
═══════════════════════════════════════════ */
const AVAILABILITY = ['Disponible', 'Sur réservation', 'Édition limitée', 'Rupture de stock'];
const formatPrice = (v) => `${Number(v || 0).toLocaleString('fr-FR')} FCFA`;

/* Contrôles qualité : ce qui mérite l'attention de l'équipe, produit par produit. */
const auditProduct = (p) => {
  const issues = [];
  if (!p.image) issues.push('Aucune photo');
  else if (/^https?:/.test(p.image) && !/images\.unsplash\.com/.test(p.image)) {
    issues.push('Photo hébergée sur un autre site : elle peut disparaître sans prévenir');
  }
  if (!p.description || p.description.trim().length < 40) issues.push('Description trop courte');
  if (!p.notes) issues.push('Notes olfactives manquantes');
  if (p.availability === 'Rupture de stock') issues.push('En rupture de stock');
  if (p.collection === 'Master' && p.masterDetails && p.masterDetails.available <= p.masterDetails.total * 0.1) {
    issues.push(`Plus que ${p.masterDetails.available} pièces Master`);
  }
  return issues;
};

const Thumb = ({ p }) => (p.image
  ? <img src={p.image} alt="" className="ad-thumb" />
  : <span className="ad-thumb ad-thumb--empty"><ImageOff size={16} aria-hidden="true" /></span>);

const ConfirmModal = ({ title, text, confirmLabel, onConfirm, onClose }) => (
  <div className="admin__modal-overlay" onClick={onClose}>
    <div className="admin__modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
      <h2 id="confirm-title" className="ad-modal__title">{title}</h2>
      <p className="ad-modal__text">{text}</p>
      <div className="ad-modal__actions">
        <button className="admin__btn admin__btn--ghost" onClick={onClose} autoFocus>Annuler</button>
        <button className="admin__btn admin__btn--danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

const Bars = ({ title, rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="ad-panel">
      <h2 className="ad-panel__title">{title}</h2>
      <ul className="ad-bars">
        {rows.map((r) => (
          <li key={r.label} className="ad-bars__row" title={`${r.label} : ${r.value} parfum${r.value > 1 ? 's' : ''}`}>
            <span className="ad-bars__label">{r.label}</span>
            <span className="ad-bars__track"><span className="ad-bars__fill" style={{ width: `${(r.value / max) * 100}%` }} /></span>
            <span className="ad-bars__value">{r.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

/* ═══════════════════════════════════════════
   MAIN ADMIN COMPONENT
═══════════════════════════════════════════ */
const NAV = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'products', label: 'Parfums', icon: Package },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

const Admin = () => {
  const {
    products, settings, collections, genders,
    isAdminAuthenticated, loginAdmin, logoutAdmin,
    addProduct, updateProduct, deleteProduct,
    updateSettings, resetProducts, resetSettings,
  } = useProducts();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [sort, setSort] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState(settings);
  const [showPin, setShowPin] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => { setSettingsForm(settings); }, [settings]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  if (!isAdminAuthenticated) {
    return <LoginScreen onLogin={loginAdmin} />;
  }

  /* ── Navigation ── */
  const go = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setEditProduct(null);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };
  const openEdit = (p) => { setEditProduct(p); setShowForm(true); setActiveTab('form'); window.scrollTo(0, 0); };
  const openCreate = () => { setEditProduct(null); setShowForm(true); setActiveTab('form'); window.scrollTo(0, 0); };
  const cancelForm = () => go('products');

  /* ── Actions ── */
  const handleSaveProduct = (data) => {
    if (editProduct) {
      updateProduct(editProduct.id, data);
      showToast(`« ${data.name} » est à jour sur le site.`);
    } else {
      addProduct(data);
      showToast(`« ${data.name} » est ajouté au catalogue.`);
    }
    go('products');
  };
  const duplicate = (p) => {
    addProduct({ ...p, name: `${p.name} (copie)` });
    showToast(`Copie de « ${p.name} » créée. Pensez à la renommer.`);
  };
  const askDelete = (p) => setConfirm({
    title: `Supprimer « ${p.name} » ?`,
    text: 'Le parfum disparaîtra du site immédiatement. Cette action ne peut pas être annulée.',
    confirmLabel: 'Supprimer le parfum',
    run: () => { deleteProduct(p.id); showToast(`« ${p.name} » est supprimé.`); },
  });
  const askResetProducts = () => setConfirm({
    title: 'Revenir au catalogue d’origine ?',
    text: 'Tous les parfums ajoutés ou modifiés depuis l’admin seront perdus.',
    confirmLabel: 'Réinitialiser le catalogue',
    run: () => { resetProducts(); showToast('Catalogue réinitialisé.'); },
  });
  const askResetSettings = () => setConfirm({
    title: 'Réinitialiser les paramètres ?',
    text: 'Les coordonnées et le code PIN reviendront aux valeurs par défaut.',
    confirmLabel: 'Réinitialiser',
    run: () => { resetSettings(); showToast('Paramètres réinitialisés.'); },
  });
  const handleSettingsSave = () => {
    updateSettings(settingsForm);
    showToast('Paramètres enregistrés.');
  };

  /* ── Données dérivées ── */
  const q = search.trim().toLowerCase();
  const filteredProducts = products
    .filter((p) => (!q || [p.name, p.gender, p.collection, p.notes].join(' ').toLowerCase().includes(q))
      && (!genderFilter || p.gender === genderFilter)
      && (!collectionFilter || p.collection === collectionFilter))
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name, 'fr')
      : sort === 'price-asc' ? a.price - b.price : b.price - a.price));

  const prices = products.map((p) => p.price);
  const available = products.filter((p) => (p.availability || 'Disponible') !== 'Rupture de stock').length;
  const masters = products.filter((p) => p.collection === 'Master' && p.masterDetails);
  const masterLeft = masters.reduce((s, p) => s + Number(p.masterDetails.available || 0), 0);
  const masterTotal = masters.reduce((s, p) => s + Number(p.masterDetails.total || 0), 0);
  const avgPrice = prices.length ? Math.round(prices.reduce((s, v) => s + v, 0) / prices.length) : 0;
  const toCheck = products.map((p) => ({ p, issues: auditProduct(p) })).filter((x) => x.issues.length);

  const title = {
    dashboard: 'Tableau de bord',
    products: 'Parfums',
    form: editProduct ? `Modifier ${editProduct.name}` : 'Nouveau parfum',
    settings: 'Paramètres',
  }[activeTab];

  return (
    <div className="admin">
      {/* ── Navigation ── */}
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`} aria-label="Administration">
        <div className="ad-brand">
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="" />
          <div>
            <p className="ad-brand__name">LUX AURA</p>
            <p className="ad-brand__sub">Administration</p>
          </div>
        </div>
        <nav className="ad-nav">
          {NAV.map(({ id, label, icon: Icon }) => {
            const on = activeTab === id || (id === 'products' && activeTab === 'form');
            return (
              <button key={id} className={`ad-nav__item ${on ? 'ad-nav__item--on' : ''}`} aria-current={on ? 'page' : undefined} onClick={() => go(id)}>
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" /> {label}
                {id === 'dashboard' && toCheck.length > 0 && <span className="ad-nav__count" aria-label={`${toCheck.length} à vérifier`}>{toCheck.length}</span>}
              </button>
            );
          })}
        </nav>
        <div className="ad-sidefoot">
          <Link to="/" className="ad-sidefoot__link"><ExternalLink size={16} aria-hidden="true" /> Voir le site</Link>
          <button className="ad-sidefoot__link" onClick={logoutAdmin}><LogOut size={16} aria-hidden="true" /> Se déconnecter</button>
        </div>
      </aside>
      {sidebarOpen && <button className="ad-scrim" aria-label="Fermer le menu" onClick={() => setSidebarOpen(false)} />}

      <main className="admin__main">
        <header className="ad-top">
          <button className="ad-top__menu" aria-label="Ouvrir le menu" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          {activeTab === 'form' && (
            <button className="ad-top__back" onClick={cancelForm} aria-label="Retour aux parfums"><ArrowLeft size={18} /></button>
          )}
          <h1 className="ad-top__title">{title}</h1>
          <div className="ad-top__actions">
            {(activeTab === 'products' || activeTab === 'dashboard') && (
              <button className="admin__btn admin__btn--primary" onClick={openCreate}><Plus size={17} aria-hidden="true" /> <span className="ad-hide-sm">Ajouter un parfum</span></button>
            )}
          </div>
        </header>

        <div className="admin__content">
          {/* ════════ TABLEAU DE BORD ════════ */}
          {activeTab === 'dashboard' && (
            <div className="ad-dash">
              <div className="ad-tiles">
                <div className="ad-tile">
                  <p className="ad-tile__label">Parfums au catalogue</p>
                  <p className="ad-tile__value">{products.length}</p>
                  <p className="ad-tile__meta">{genders.map((g) => `${products.filter((p) => p.gender === g).length} ${g.toLowerCase()}`).join(', ')}</p>
                </div>
                <div className="ad-tile">
                  <p className="ad-tile__label">Disponibles à la vente</p>
                  <p className="ad-tile__value">{available}<span> / {products.length}</span></p>
                  <p className="ad-tile__meta">{products.length - available} en rupture</p>
                </div>
                <div className="ad-tile">
                  <p className="ad-tile__label">Pièces Master restantes</p>
                  <p className="ad-tile__value">{masterLeft}<span> / {masterTotal}</span></p>
                  <span className="ad-meter" role="img" aria-label={`${masterLeft} pièces restantes sur ${masterTotal}`}>
                    <span style={{ width: `${masterTotal ? (masterLeft / masterTotal) * 100 : 0}%` }} />
                  </span>
                </div>
                <div className="ad-tile">
                  <p className="ad-tile__label">Prix moyen</p>
                  <p className="ad-tile__value ad-tile__value--sm">{formatPrice(avgPrice)}</p>
                  {prices.length > 0 && <p className="ad-tile__meta">de {formatPrice(Math.min(...prices))} à {formatPrice(Math.max(...prices))}</p>}
                </div>
              </div>

              <section className="ad-panel">
                <div className="ad-panel__head">
                  <h2 className="ad-panel__title">À vérifier</h2>
                  <p className="ad-panel__sub">{toCheck.length ? `${toCheck.length} parfum${toCheck.length > 1 ? 's' : ''} à compléter ou corriger` : 'Tout est en ordre.'}</p>
                </div>
                {toCheck.length > 0 && (
                  <ul className="ad-check">
                    {toCheck.map(({ p, issues }) => (
                      <li key={p.id} className="ad-check__row">
                        <Thumb p={p} />
                        <div className="ad-check__body">
                          <p className="ad-check__name">{p.name}</p>
                          <ul className="ad-check__issues">
                            {issues.map((i) => <li key={i}><TriangleAlert size={14} aria-hidden="true" /> {i}</li>)}
                          </ul>
                        </div>
                        <button className="admin__btn admin__btn--ghost" onClick={() => openEdit(p)}>Corriger</button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <div className="ad-split">
                <Bars title="Parfums par genre" rows={genders.map((g) => ({ label: g, value: products.filter((p) => p.gender === g).length }))} />
                <Bars title="Parfums par collection" rows={collections.map((c) => ({ label: c, value: products.filter((p) => p.collection === c).length }))} />
              </div>
            </div>
          )}

          {/* ════════ PARFUMS ════════ */}
          {activeTab === 'products' && (
            <>
              <div className="ad-toolbar">
                <label className="ad-search">
                  <Search size={17} aria-hidden="true" />
                  <input placeholder="Nom, note, collection…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Rechercher un parfum" />
                  {search && <button type="button" onClick={() => setSearch('')} aria-label="Effacer la recherche"><X size={15} /></button>}
                </label>
                <select className="ad-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} aria-label="Genre">
                  <option value="">Tous les genres</option>
                  {genders.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <select className="ad-select" value={collectionFilter} onChange={(e) => setCollectionFilter(e.target.value)} aria-label="Collection">
                  <option value="">Toutes les collections</option>
                  {collections.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="ad-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Trier">
                  <option value="name">Nom A → Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
                <div className="ad-view" role="group" aria-label="Affichage">
                  <button aria-pressed={viewMode === 'table'} onClick={() => setViewMode('table')} aria-label="Liste"><List size={17} /></button>
                  <button aria-pressed={viewMode === 'cards'} onClick={() => setViewMode('cards')} aria-label="Grille"><LayoutGrid size={17} /></button>
                </div>
              </div>
              <p className="ad-count">{filteredProducts.length} parfum{filteredProducts.length > 1 ? 's' : ''}</p>

              {filteredProducts.length === 0 ? (
                <div className="ad-empty">
                  <p>Aucun parfum ne correspond à cette recherche.</p>
                  <button className="admin__btn admin__btn--ghost" onClick={() => { setSearch(''); setGenderFilter(''); setCollectionFilter(''); }}>Effacer les filtres</button>
                </div>
              ) : viewMode === 'table' ? (
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr><th>Parfum</th><th>Genre</th><th>Collection</th><th className="ad-num">Prix</th><th>Disponibilité</th><th><span className="sr-only">Actions</span></th></tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <button className="ad-prod" onClick={() => openEdit(p)}>
                              <Thumb p={p} />
                              <span><strong>{p.name}</strong><small>{p.volume}{p.collection === 'Master' && p.masterDetails ? `, ${p.masterDetails.available} / ${p.masterDetails.total} pièces` : ''}</small></span>
                            </button>
                          </td>
                          <td>{p.gender}</td>
                          <td><span className={`ad-tag ${p.collection === 'Master' ? 'ad-tag--master' : ''}`}>{p.collection}</span></td>
                          <td className="ad-num">{formatPrice(p.price)}</td>
                          <td>
                            <select
                              className={`ad-avail ${(p.availability || 'Disponible') === 'Rupture de stock' ? 'ad-avail--off' : ''}`}
                              value={p.availability || 'Disponible'}
                              aria-label={`Disponibilité de ${p.name}`}
                              onChange={(e) => { updateProduct(p.id, { availability: e.target.value }); showToast(`« ${p.name} » : ${e.target.value.toLowerCase()}.`); }}
                            >
                              {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
                            </select>
                          </td>
                          <td>
                            <div className="ad-actions">
                              <a className="ad-icon" href={`${import.meta.env.BASE_URL}produit/${p.id}`} target="_blank" rel="noreferrer" title="Voir sur le site" aria-label={`Voir ${p.name} sur le site`}><Eye size={17} /></a>
                              <button className="ad-icon" onClick={() => openEdit(p)} title="Modifier" aria-label={`Modifier ${p.name}`}><Pencil size={17} /></button>
                              <button className="ad-icon" onClick={() => duplicate(p)} title="Dupliquer" aria-label={`Dupliquer ${p.name}`}><Copy size={17} /></button>
                              <button className="ad-icon ad-icon--danger" onClick={() => askDelete(p)} title="Supprimer" aria-label={`Supprimer ${p.name}`}><Trash2 size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ul className="ad-grid">
                  {filteredProducts.map((p) => (
                    <li key={p.id} className="ad-card">
                      <button className="ad-card__media" onClick={() => openEdit(p)} aria-label={`Modifier ${p.name}`}>
                        {p.image ? <img src={p.image} alt="" /> : <ImageOff size={22} aria-hidden="true" />}
                      </button>
                      <div className="ad-card__body">
                        <p className="ad-card__name">{p.name}</p>
                        <p className="ad-card__meta">{p.gender}, {p.collection}, {p.volume}</p>
                        <p className="ad-card__price">{formatPrice(p.price)}</p>
                      </div>
                      <div className="ad-actions">
                        <button className="ad-icon" onClick={() => openEdit(p)} aria-label={`Modifier ${p.name}`}><Pencil size={17} /></button>
                        <button className="ad-icon" onClick={() => duplicate(p)} aria-label={`Dupliquer ${p.name}`}><Copy size={17} /></button>
                        <button className="ad-icon ad-icon--danger" onClick={() => askDelete(p)} aria-label={`Supprimer ${p.name}`}><Trash2 size={17} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* ════════ FORMULAIRE ════════ */}
          {activeTab === 'form' && showForm && (
            <ProductForm product={editProduct} onSave={handleSaveProduct} onCancel={cancelForm} collections={collections} genders={genders} />
          )}

          {/* ════════ PARAMÈTRES ════════ */}
          {activeTab === 'settings' && (
            <div className="ad-settings">
              <section className="admin__form-section">
                <h2 className="admin__form-section-title">Coordonnées affichées</h2>
                <div className="admin__form-grid">
                  {[['siteName', 'Nom du site'], ['currency', 'Devise'], ['contactEmail', 'E-mail de contact'], ['contactPhone', 'Téléphone']].map(([k, label]) => (
                    <div className="admin__form-group" key={k}>
                      <label className="admin__form-label" htmlFor={`set-${k}`}>{label}</label>
                      <input id={`set-${k}`} className="admin__form-input" value={settingsForm[k] || ''}
                        onChange={(e) => setSettingsForm((s) => ({ ...s, [k]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin__form-section">
                <h2 className="admin__form-section-title">Accès à l’administration</h2>
                <div className="admin__form-group">
                  <label className="admin__form-label" htmlFor="set-pin">Code PIN</label>
                  <div className="ad-pin">
                    <input id="set-pin" className="admin__form-input" type={showPin ? 'text' : 'password'} inputMode="numeric" value={settingsForm.adminPin || ''}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, adminPin: e.target.value }))} />
                    <button type="button" className="ad-icon" onClick={() => setShowPin((v) => !v)} aria-label={showPin ? 'Masquer le code' : 'Afficher le code'}><Eye size={17} /></button>
                  </div>
                  <p className="ad-help">Ce code protège l’accès sur cet appareil uniquement : les données sont enregistrées dans ce navigateur.</p>
                </div>
              </section>

              <div className="admin__form-actions">
                <button className="admin__btn admin__btn--primary" onClick={handleSettingsSave}><Save size={17} aria-hidden="true" /> Enregistrer</button>
              </div>

              <section className="admin__form-section ad-danger">
                <h2 className="admin__form-section-title">Réinitialisation</h2>
                <p className="ad-help">À utiliser seulement pour repartir de zéro.</p>
                <div className="ad-danger__actions">
                  <button className="admin__btn admin__btn--ghost" onClick={askResetSettings}><RotateCcw size={16} aria-hidden="true" /> Réinitialiser les paramètres</button>
                  <button className="admin__btn admin__btn--danger" onClick={askResetProducts}><RotateCcw size={16} aria-hidden="true" /> Réinitialiser le catalogue</button>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          text={confirm.text}
          confirmLabel={confirm.confirmLabel}
          onClose={() => setConfirm(null)}
          onConfirm={() => { confirm.run(); setConfirm(null); }}
        />
      )}

      {toast && <div className="admin__toast" role="status"><Check size={17} aria-hidden="true" /> {toast}</div>}
    </div>
  );
};

export default Admin;

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { quoteService } from '../services/quoteService';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useSeo } from '../hooks/useSeo';

// Sanitize input to prevent XSS
const sanitizeText = (text: string) =>
  text.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();

// Email validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

type SelectedProduct = {
  produitId?: string;
  libelleCustom?: string;
  quantite: number;
  besoinsSpecifiques: string;
};

export const Quote = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    societe: '',
    email: '',
    telephone: '',
    adresse: '',
    notes: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useSeo({
    title: 'Demande de devis | Yooreed Events',
    description: 'Composez votre demande de devis pour vos supports et solutions événementielles Yooreed Events.',
  });

  useEffect(() => {
    if (items.length > 0) {
      setSelectedProducts(
        items.map((item) => ({
          produitId: item.product._id,
          quantite: item.quantity,
          besoinsSpecifiques: item.personalization || '',
        }))
      );
      setProducts(items.map((item) => item.product));
    } else {
      const produitId = searchParams.get('produit');
      if (produitId) {
        productService.getById(produitId).then((res) => {
          const product = res.data.product;
          setProducts([product]);
          setSelectedProducts([{ produitId: product._id, quantite: 1, besoinsSpecifiques: '' }]);
        }).catch(() => {});
      }
    }
  }, [items, searchParams]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nom.trim() || formData.nom.trim().length < 2)
      errs.nom = 'Le nom est requis (min. 2 caractères).';
    if (!formData.email.trim())
      errs.email = "L'email est requis.";
    else if (!isValidEmail(formData.email))
      errs.email = 'Email invalide.';
    if (!formData.telephone.trim())
      errs.telephone = 'Le téléphone est requis.';
    if (!formData.adresse.trim())
      errs.adresse = "L'adresse est requise.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmit < 3000) return; // Rate limit 3s
    setLastSubmit(now);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setSuccessMessage(null);

    try {
      const fallbackProduct: SelectedProduct = {
        libelleCustom: 'Demande générale de devis',
        quantite: 1,
        besoinsSpecifiques: sanitizeText(formData.notes) || 'Demande générale depuis le formulaire devis',
      };

      const quoteData = {
        client: {
          nom: sanitizeText(formData.nom),
          societe: sanitizeText(formData.societe),
          email: formData.email.trim().toLowerCase(),
          telephone: formData.telephone.replace(/\s/g, ''),
          adresse: sanitizeText(formData.adresse),
        },
        produits: selectedProducts.length > 0 ? selectedProducts : [fallbackProduct],
        notes: sanitizeText(formData.notes),
      };

      await quoteService.create(quoteData);
      setSuccessMessage('Votre demande de devis a bien été envoyée. Nous vous répondrons rapidement.');
      setTimeout(() => navigate('/devis/succes'), 1200);
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || error?.message || 'Erreur lors de l\'envoi. Veuillez réessayer.';
      setFieldErrors({ _global: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const updateProductNeeds = (produitId: string, besoinsSpecifiques: string) => {
    setSelectedProducts(prev =>
      prev.map(p => p.produitId === produitId ? { ...p, besoinsSpecifiques } : p)
    );
  };

  const FieldError = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <nav className="breadcrumb mb-4">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Demande de devis</span>
          </nav>
          <div className="section-label mb-4 inline-flex">Devis gratuit</div>
          <h1 className="section-title mb-3">Demander un devis</h1>
          <p style={{ color: '#64748b' }}>
            Décrivez vos besoins et nous vous ferons parvenir une proposition sous 24h.
          </p>
        </div>

        {/* Global error */}
        {fieldErrors._global && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#fca5a5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm" style={{ color: '#fca5a5' }}>{fieldErrors._global}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#6ee7b7" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm" style={{ color: '#6ee7b7' }}>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* CSRF token simulé */}
          <input type="hidden" name="_csrf" value={Math.random().toString(36).slice(2)} />

          {/* Informations Client */}
          <div className="card mb-6">
            <h2 className="text-lg font-bold text-white mb-6">Informations client</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="quote-nom" className="block text-sm font-medium text-white mb-2">
                  Nom complet <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="quote-nom"
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Votre nom"
                  className={`input ${fieldErrors.nom ? 'input-error' : ''}`}
                />
                <FieldError field="nom" />
              </div>

              <div>
                <label htmlFor="quote-societe" className="block text-sm font-medium text-white mb-2">Société</label>
                <input
                  id="quote-societe"
                  type="text"
                  name="societe"
                  value={formData.societe}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="organization"
                  placeholder="Nom de votre société"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="quote-email" className="block text-sm font-medium text-white mb-2">
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="quote-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={150}
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                />
                <FieldError field="email" />
              </div>

              <div>
                <label htmlFor="quote-telephone" className="block text-sm font-medium text-white mb-2">
                  Téléphone <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="quote-telephone"
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  maxLength={20}
                  autoComplete="tel"
                  placeholder="+216 98 000 000"
                  className={`input ${fieldErrors.telephone ? 'input-error' : ''}`}
                />
                <FieldError field="telephone" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="quote-adresse" className="block text-sm font-medium text-white mb-2">
                  Adresse / Ville <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="quote-adresse"
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  maxLength={200}
                  autoComplete="street-address"
                  placeholder="Votre adresse ou ville"
                  className={`input ${fieldErrors.adresse ? 'input-error' : ''}`}
                />
                <FieldError field="adresse" />
              </div>
            </div>
          </div>

          {/* Produits sélectionnés */}
          {products.length > 0 && (
            <div className="card mb-6">
              <h2 className="text-lg font-bold text-white mb-5">
                Produits ({products.length})
              </h2>
              <div className="space-y-4">
                {products.map((product) => {
                  const selected = selectedProducts.find(p => p.produitId === product._id);
                  return (
                    <div
                      key={product._id}
                      className="flex gap-4 p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.nom}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{product.nom}</h4>
                        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#64748b' }}>{product.description}</p>
                        <textarea
                          value={selected?.besoinsSpecifiques || ''}
                          onChange={e => updateProductNeeds(product._id, e.target.value)}
                          rows={2}
                          maxLength={500}
                          className="textarea text-xs py-2"
                          placeholder="Besoins spécifiques pour ce produit…"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="card mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Notes additionnelles</h2>
            <textarea
              id="quote-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              maxLength={2000}
              className="textarea"
              placeholder="Décrivez votre événement, la date, le lieu et tous détails utiles pour votre devis…"
            />
            <p className="text-xs mt-1.5 text-right" style={{ color: '#475569' }}>{formData.notes.length}/2000</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Envoi en cours…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Envoyer la demande de devis
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>
            )}
          </button>
          <p className="mt-3 text-xs text-center" style={{ color: '#334155' }}>
            Vos données sont traitées conformément à notre{' '}
            <Link to="/politique-confidentialite" className="underline hover:text-slate-400" style={{ color: '#475569' }}>
              politique de confidentialité
            </Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

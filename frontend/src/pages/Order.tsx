import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { useSeo } from '../hooks/useSeo';

// Sanitize input to prevent XSS
const sanitizeText = (text: string) =>
  text.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();

// Email validation Helper
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const Order = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const [formData, setFormData] = useState({
    nom: '',
    societe: '',
    email: '',
    telephone: '',
    adresse: '',
    instructions: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useSeo({
    title: 'Finaliser ma commande | Yooreed Events',
    description:
      'Confirmez votre sélection d\'équipements événementiels et validez votre commande en toute sécurité.',
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nom.trim() || formData.nom.trim().length < 2)
      errs.nom = 'Le nom est requis (min. 2 caractères).';
    if (!formData.email.trim())
      errs.email = "L'email est requis.";
    else if (!isValidEmail(formData.email))
      errs.email = 'Format d\'email invalide.';
    if (!formData.telephone.trim())
      errs.telephone = 'Le numéro de téléphone est requis.';
    if (!formData.adresse.trim())
      errs.adresse = "L'adresse de livraison est requise.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Antispam / Rate limit 3s
    const now = Date.now();
    if (now - lastSubmit < 3000) return;
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
      const orderData = {
        client: {
          nom: sanitizeText(formData.nom),
          societe: sanitizeText(formData.societe),
          email: formData.email.trim().toLowerCase(),
          telephone: formData.telephone.replace(/\s/g, ''),
          adresse: sanitizeText(formData.adresse),
        },
        produits: items.map((item) => ({
          produitId: item.product._id,
          quantite: item.quantity,
          personnalisation: sanitizeText(item.personalization || ''),
        })),
        instructions: sanitizeText(formData.instructions),
      };

      await orderService.create(orderData);
      clearCart();
      setSuccessMessage('Votre commande est enregistrée. Redirection vers la confirmation...');
      setTimeout(() => navigate('/commande/succes'), 1500);
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || error?.message || 'Une erreur est survenue lors de la commande.';
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center" style={{ background: '#080C14' }}>
        <div className="max-w-md text-center px-6">
          <h1 className="text-3xl font-bold text-white mb-4">Votre panier est vide</h1>
          <p className="text-slate-500 mb-8">Ajoutez des équipements à votre sélection avant de passer commande.</p>
          <Link to="/catalogue" className="btn-primary">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center sm:text-left">
          <div className="section-label mb-4 inline-flex">Checkout</div>
          <h1 className="section-title mb-2">Finaliser ma commande</h1>
          <p className="text-slate-500">Renseignez vos coordonnées pour la livraison et la facturation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-8">
            {fieldErrors._global && (
              <div className="p-4 rounded-xl flex gap-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p style={{ color: '#fca5a5' }}>{fieldErrors._global}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl flex gap-3 text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p style={{ color: '#6ee7b7' }}>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="card p-8">
                <h2 className="text-xl font-bold text-white mb-8">Informations de livraison</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Nom complet <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      className={`input ${fieldErrors.nom ? 'input-error' : ''}`}
                    />
                    {fieldErrors.nom && <p className="text-[10px] text-red-400 mt-1">{fieldErrors.nom}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Société</label>
                    <input
                      type="text"
                      name="societe"
                      value={formData.societe}
                      onChange={handleChange}
                      placeholder="Nom de l'entreprise"
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean@monentreprise.tn"
                      className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                    />
                    {fieldErrors.email && <p className="text-[10px] text-red-400 mt-1">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Téléphone <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="98 218 802"
                      className={`input ${fieldErrors.telephone ? 'input-error' : ''}`}
                    />
                    {fieldErrors.telephone && <p className="text-[10px] text-red-400 mt-1">{fieldErrors.telephone}</p>}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-white mb-2">Adresse / Ville <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Novation City, Batiment 6000, Sousse"
                    className={`input ${fieldErrors.adresse ? 'input-error' : ''}`}
                  />
                  {fieldErrors.adresse && <p className="text-[10px] text-red-400 mt-1">{fieldErrors.adresse}</p>}
                </div>

                <div className="mb-0">
                  <label className="block text-sm font-medium text-white mb-2">Instructions ou Notes</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Instructions pour la livraison ou détails sur l'événement..."
                    className="textarea"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Récapitulatif Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-0 sticky top-32 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Récapitulatif</h2>
              </div>
              
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-3">
                    <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex-shrink-0 overflow-hidden">
                      {item.product.images[0] && <img src={item.product.images[0]} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.product.nom}</p>
                      <p className="text-[10px] text-slate-500">Qte: {item.quantity} × {item.product.prix} TND</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Sous-total</span>
                  <span className="text-white font-bold">{getTotal()} TND</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Livraison</span>
                  <span className="text-white font-bold italic">Calculée ultérieurement</span>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-between items-center text-lg">
                  <span className="text-white font-black uppercase tracking-wider text-sm">Total Estimation</span>
                  <span className="text-2xl font-black text-violet-400">{getTotal()} <span className="text-xs font-normal">TND</span></span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full btn-primary py-4 justify-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                       Traitement...
                    </span>
                  ) : 'Confirmer la commande'}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2z" /></svg>
                  Transactions sécurisées via Yooreed Events
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

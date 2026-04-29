import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSeo } from '../hooks/useSeo';

export const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  useSeo({
    title: 'Votre panier | Yooreed Events',
    description:
      'Retrouvez le détail de vos équipements événementiels sélectionnés et finalisez votre chiffrage ou commande sur Yooreed Events.',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center" style={{ background: '#080C14' }}>
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 21z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Votre panier est vide</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Parcourez notre catalogue d'équipements premium pour votre prochain événement.
          </p>
          <Link to="/catalogue" className="btn-primary inline-flex">
            Découvrir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="section-label mb-4 inline-flex">Sélection</div>
          <h1 className="section-title mb-2">Mon Panier</h1>
          <p className="text-slate-500">{items.length} produit(s) sélectionné(s)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-0 overflow-hidden divide-y divide-white/5">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex flex-col sm:flex-row items-center p-6 gap-6 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="relative group w-32 h-32 sm:w-28 sm:h-28 flex-shrink-0">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.nom}
                        className="w-full h-full object-cover rounded-xl border border-white/10"
                      />
                    ) : (
                      <div className="w-full h-full bg-navy-900 rounded-xl border border-white/10 flex items-center justify-center">
                        <span className="text-xs text-slate-600 italic">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <Link
                      to={`/produit/${item.product._id}`}
                      className="text-lg font-bold text-white hover:text-violet-400 transition-colors block truncate"
                    >
                      {item.product.nom}
                    </Link>
                    {item.personalization && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        <span className="text-violet-500">Perso :</span> {item.personalization}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-center sm:justify-start gap-4">
                      <span className="text-xl font-black text-white">{item.product.prix} <span className="text-sm font-normal text-slate-500">TND</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 mx-auto sm:mx-0 text-xs"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="text-slate-600 hover:text-slate-400 text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Vider le panier
            </button>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-32">
              <h2 className="text-xl font-bold text-white mb-8">Récapitulatif</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400">
                  <span className="text-sm">Sous-total</span>
                  <span className="font-bold text-white">{total} TND</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="text-sm">TVA (0%)</span>
                  <span className="font-bold text-white">0 TND</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-white font-bold">Total Estimation</span>
                  <span className="text-2xl font-black text-violet-400">{total} <span className="text-xs font-normal">TND</span></span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/devis"
                  className="btn-primary w-full justify-center group py-4"
                >
                  Demander un devis
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link
                  to="/commande"
                  className="btn-secondary w-full justify-center py-4"
                >
                  Passer la commande
                </Link>
              </div>
              
              <p className="mt-6 text-[10px] text-center text-slate-600 leading-relaxed">
                Note : Les prix affichés sont indicatifs et peuvent varier selon les options de personnalisation et les frais de livraison.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

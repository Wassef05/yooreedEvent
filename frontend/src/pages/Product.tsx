import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSeo } from '../hooks/useSeo';
import { MOCK_PRODUCTS } from '../data/mockData';
import { getCategoryBySlug, getParentCategoryBySubSlug } from '../data/categoryTree';
import DOMPurify from 'dompurify';

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ images, initialIdx, onClose }: { images: string[]; initialIdx: number; onClose: () => void }) => {
  const [idx, setIdx] = useState(initialIdx);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose} style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}>
      <button className="absolute top-5 right-5 text-white p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={onClose} aria-label="Fermer">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-colors" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} aria-label="Précédent">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <img
        src={images[idx]}
        alt={`Image ${idx + 1}`}
        className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
        onClick={e => e.stopPropagation()}
      />
      <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-colors" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} aria-label="Suivant">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{idx + 1} / {images.length}</div>
    </div>
  );
};

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [personalization, setPersonalization] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'technique' | 'livraison'>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useSeo({
    title: product?.nom || 'Détail produit | Yooreed Events',
    description: product?.description || 'Découvrez ce produit Yooreed Events.',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await productService.getById(id);
        const p: Product = res.data.product;
        setProduct(p);
        // Related products by category
        const related = MOCK_PRODUCTS.filter(mp => mp.categorie === p.categorie && mp._id !== p._id).slice(0, 4);
        setRelatedProducts(related);
      } catch {
        const mockProduct = MOCK_PRODUCTS.find(p => p._id === id);
        if (mockProduct) {
          setProduct(mockProduct);
          const related = MOCK_PRODUCTS.filter(mp => mp.categorie === mockProduct.categorie && mp._id !== mockProduct._id).slice(0, 4);
          setRelatedProducts(related);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, personalization);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleRequestQuote = () => {
    navigate(`/devis?produit=${product?._id}`);
  };

  // Breadcrumb
  const getBreadcrumb = (p: Product) => {
    const mainCat = getCategoryBySlug(p.categorie);
    if (mainCat) return [{ label: mainCat.label, slug: mainCat.slug }];
    const parent = getParentCategoryBySubSlug(p.categorie);
    if (parent) return [{ label: parent.label, slug: parent.slug }];
    return [{ label: p.categorie, slug: p.categorie }];
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="skeleton rounded-2xl h-96 mb-4" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton rounded-xl h-20" />)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="skeleton h-8 rounded-full w-3/4" />
              <div className="skeleton h-6 rounded-full w-1/3" />
              <div className="skeleton h-32 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ background: '#080C14' }}>
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-white mb-3">Produit non trouvé</h2>
          <p className="mb-6" style={{ color: '#64748b' }}>Ce produit n'existe pas ou a été retiré.</p>
          <Link to="/catalogue" className="btn-primary">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = getBreadcrumb(product);
  const sanitizedTechDesc = product.descriptionTechnique ? DOMPurify.sanitize(product.descriptionTechnique) : '';

  return (
    <>
      {lightboxOpen && product.images.length > 0 && (
        <Lightbox images={product.images} initialIdx={selectedImage} onClose={() => setLightboxOpen(false)} />
      )}

      <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="breadcrumb mb-8" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/catalogue">Catalogue</Link>
            {breadcrumbItems.map(item => (
              <span key={item.slug} className="contents">
                <span className="breadcrumb-sep">›</span>
                <Link to={`/catalogue?category=${item.slug}`}>{item.label}</Link>
              </span>
            ))}
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current line-clamp-1">{product.nom}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">

            {/* ── Image Gallery ───────────────────────────────────────────── */}
            <div>
              {product.images.length > 0 ? (
                <>
                  {/* Main image */}
                  <div
                    className="relative rounded-2xl overflow-hidden mb-4 cursor-zoom-in group"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', aspectRatio: '4/3' }}
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={product.images[selectedImage]}
                      alt={product.nom}
                      loading="eager"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-102 p-4"
                    />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/3 transition-colors duration-200" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.6)', color: '#e2e8f0' }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Agrandir
                    </div>
                  </div>
                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {product.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className="relative rounded-xl overflow-hidden transition-all duration-200"
                          style={{
                            aspectRatio: '1/1',
                            background: 'rgba(255,255,255,0.03)',
                            border: selectedImage === i
                              ? '2px solid rgba(124,58,237,0.8)'
                              : '2px solid rgba(255,255,255,0.06)',
                            boxShadow: selectedImage === i ? '0 0 12px rgba(124,58,237,0.3)' : 'none',
                          }}
                          aria-label={`Image ${i + 1}`}
                        >
                          <img src={img} alt={`${product.nom} ${i + 1}`} loading="lazy" className="w-full h-full object-contain p-1.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center rounded-2xl text-slate-600 text-sm" style={{ aspectRatio: '4/3', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  Aperçu à venir
                </div>
              )}

              {/* Videos */}
              {product.videos.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-white mb-3">Vidéos de présentation</p>
                  <div className="space-y-3">
                    {product.videos.map((video, i) => (
                      <video key={i} src={video} controls className="w-full rounded-xl" style={{ background: '#000' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Product Info ─────────────────────────────────────────────── */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.prix === 0 && <span className="badge-cyber">Sur devis</span>}
                {product.gravureLaser && <span className="badge-soft">Gravure laser ✦</span>}
                {product.resine && <span className="badge-soft">Résine premium</span>}
                {product.stock > 0 && <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>En stock ({product.stock})</span>}
                {product.stock === 0 && product.prix > 0 && <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>Rupture de stock</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{product.nom}</h1>

              {product.prix > 0 && (
                <div className="mb-6">
                  <p className="text-3xl font-black gradient-text-gold">{product.prix} TND</p>
                  <p className="text-xs mt-1" style={{ color: '#475569' }}>Prix TTC · Livraison en sus</p>
                </div>
              )}

              {product.delaiLivraison && (
                <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#67e8f9" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm" style={{ color: '#67e8f9' }}>Délai : {product.delaiLivraison}</span>
                </div>
              )}

              {/* Tabs */}
              <div className="mb-5">
                <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {([
                    { key: 'description', label: 'Description' },
                    ...(sanitizedTechDesc ? [{ key: 'technique', label: 'Fiche technique' }] : []),
                    ...(product.personnalisation.length > 0 || product.delaiLivraison ? [{ key: 'livraison', label: 'Options & livraison' }] : []),
                  ] as { key: typeof activeTab; label: string }[]).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      style={activeTab === tab.key ? { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' } : {}}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {activeTab === 'description' && (
                    <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                      {product.description || 'Aucune description disponible.'}
                    </p>
                  )}
                  {activeTab === 'technique' && sanitizedTechDesc && (
                    <div
                      className="prose prose-sm prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: sanitizedTechDesc }}
                      style={{ color: '#94a3b8' }}
                    />
                  )}
                  {activeTab === 'livraison' && (
                    <div className="space-y-4">
                      {product.personnalisation.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-2">Options de personnalisation</h3>
                          <ul className="space-y-1">
                            {product.personnalisation.map((opt, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                                <span style={{ color: '#7C3AED' }}>✦</span>
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {product.materiaux.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-2">Matériaux</h3>
                          <div className="flex flex-wrap gap-2">
                            {product.materiaux.map((m, i) => <span key={i} className="tag-soft">{m}</span>)}
                          </div>
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Livraison & garantie</h3>
                        <ul className="space-y-1 text-sm" style={{ color: '#94a3b8' }}>
                          {product.delaiLivraison && <li className="flex items-center gap-2"><span style={{ color: '#7C3AED' }}>✦</span>Délai indicatif : {product.delaiLivraison}</li>}
                          <li className="flex items-center gap-2"><span style={{ color: '#7C3AED' }}>✦</span>Contrôle qualité avant expédition</li>
                          <li className="flex items-center gap-2"><span style={{ color: '#7C3AED' }}>✦</span>Accompagnement disponible pour la mise en place</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {product.prix > 0 ? (
                  <>
                    {/* Qty */}
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-white">Quantité</label>
                      <div className="flex items-center gap-2 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-all"
                          aria-label="Diminuer la quantité"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-all"
                          aria-label="Augmenter la quantité"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </div>

                    {/* Personalization */}
                    {product.personnalisation.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Détails de personnalisation
                        </label>
                        <textarea
                          value={personalization}
                          onChange={e => setPersonalization(e.target.value.slice(0, 500))}
                          placeholder="Précisez vos besoins (logo, texte, couleurs…)"
                          className="textarea text-sm h-24"
                        />
                        <p className="text-xs mt-1 text-right" style={{ color: '#475569' }}>{personalization.length}/500</p>
                      </div>
                    )}

                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || addedToCart}
                      className={`w-full py-3.5 rounded-full text-sm font-semibold transition-all duration-300 ${addedToCart ? 'text-emerald-300' : 'btn-primary'}`}
                      style={addedToCart ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' } : {}}
                    >
                      {addedToCart ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Ajouté au panier !
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          Ajouter au panier
                        </span>
                      )}
                    </button>
                    <button onClick={handleRequestQuote} className="w-full btn-secondary py-3.5">
                      Demander un devis personnalisé
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl text-sm" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                      Ce produit est disponible sur devis uniquement. Contactez-nous pour obtenir une proposition adaptée à votre événement.
                    </div>
                    <button onClick={handleRequestQuote} className="w-full btn-primary py-3.5">
                      Demander un devis gratuit
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                    <Link to="/contact" className="w-full btn-secondary py-3.5 flex items-center justify-center">
                      Parler à un expert
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Related Products ───────────────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <div className="divider-cyber mb-16" />
              <h2 className="text-2xl font-bold text-white mb-8">Produits similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map(p => (
                  <Link
                    key={p._id}
                    to={`/produit/${p._id}`}
                    className="group product-card"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <div className="relative h-40 overflow-hidden">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.nom} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs" style={{ background: 'rgba(255,255,255,0.02)' }}>Aperçu bientôt</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-violet-300 transition-colors">{p.nom}</h3>
                      {p.prix > 0 ? (
                        <p className="text-sm font-bold gradient-text-gold mt-2">{p.prix} TND</p>
                      ) : (
                        <p className="text-xs mt-2" style={{ color: '#a78bfa' }}>Sur devis</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

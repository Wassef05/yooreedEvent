import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { eventServiceApi } from '../services/eventService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSeo } from '../hooks/useSeo';
import { MOCK_PRODUCTS } from '../data/mockData';
import { CATEGORY_TREE } from '../data/categoryTree';

import slide1 from '../../assets/images/yooreed_slider_1_pupitres.png';
import slide2 from '../../assets/images/yooreed_slider_3_trophees.png';
import slide3 from '../../assets/images/yooreed_slider_4_cartable.png';

const SLIDE_DURATION = 6000;

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollAnimation();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1800;
    const step = (to / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, to]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [eventServices, setEventServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useSeo({
    title: 'Location & Scénographie Événementielle Premium | Yooreed Events',
    description:
      'Yooreed Events conçoit et fournit pupitres, trophées, supports de marque et solutions audiovisuelles premium pour vos événements en Tunisie.',
  });

  const slides = useMemo(() => [
    { image: slide1, tag: 'Supports Premium', title: 'Scénographie et pupitres signature', subtitle: 'Des pièces sur-mesure pour donner du caractère à vos événements.' },
    { image: slide2, tag: 'Trophées & Distinctions', title: 'Trophées premium', subtitle: 'Des récompenses qui marquent les esprits et reflètent votre marque.' },
    { image: slide3, tag: 'Kits Événementiels', title: 'Kits clé en main', subtitle: 'Identité visuelle, accessoires et présentoirs prêts à être déployés.' },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, , , eventServicesRes] = await Promise.all([
          productService.getAll({ limit: 6, sort: 'createdAt', order: 'desc' }),
          categoryService.getAll(),
          productService.getAll({ limit: 100 }),
          eventServiceApi.listPublic(),
        ]);
        const apiProducts = productsRes.data.products || [];
        setFeaturedProducts(apiProducts.length > 0 ? apiProducts.slice(0, 6) : MOCK_PRODUCTS.slice(0, 6));
        setEventServices(eventServicesRes.data.services || []);
      } catch {
        setFeaturedProducts(MOCK_PRODUCTS.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsSlideTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
        setIsSlideTransitioning(false);
      }, 300);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product, 1);
  };
  const handleOrder = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product, 1);
    navigate('/panier');
  };

  const stats = [
    { label: "Années d'expérience", value: 10, suffix: '+' },
    { label: 'Projets réalisés', value: 500, suffix: '+' },
    { label: 'Clients satisfaits', value: 200, suffix: '+' },
    { label: 'Villes couvertes', value: 15, suffix: '' },
  ];

  const Hero1 = useScrollAnimation();
  const StatsRef = useScrollAnimation();
  const CatRef = useScrollAnimation();
  const ProdRef = useScrollAnimation();
  const TeamRef = useScrollAnimation();
  const TestiRef = useScrollAnimation();
  const CtaRef = useScrollAnimation();


  return (
    <div className="min-h-screen" style={{ background: '#080C14' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Slides background */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === currentSlide && !isSlideTransitioning ? 1 : 0 }}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, rgba(8,12,20,0.55) 0%, rgba(8,12,20,0.35) 40%, rgba(8,12,20,0.85) 80%, #080C14 100%)',
            }} />
          </div>
        ))}

        {/* Ambient overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.2) 0%, transparent 70%)',
        }} />

        {/* Content */}
        <div ref={Hero1.ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-24">
          <div className={`transition-all duration-700 ${Hero1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="badge-cyber mb-6 mx-auto inline-flex">
              {slides[currentSlide].tag}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              <span style={{ color: '#e2e8f0' }}>L'événementiel</span>
              <br />
              <span className="gradient-text">redéfini</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#94a3b8' }}>
              Yooreed Events conçoit et produce vos expériences : scénographie, audiovisuel, supports premium et impression grand format en Tunisie.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/catalogue" className="btn-primary px-8 py-4 text-base">
                Explorer le catalogue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/devis" className="btn-secondary px-8 py-4 text-base">
                Demander un devis
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentSlide ? '28px' : '8px',
                height: '8px',
                background: i === currentSlide ? '#7C3AED' : 'rgba(255,255,255,0.25)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-8 z-10 hidden md:flex flex-col items-center gap-2 animate-bounce-gentle">
          <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.6))' }} />
          <svg className="w-4 h-4" fill="none" stroke="rgba(124,58,237,0.6)" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="relative py-16 overflow-hidden">
        <div className="divider-cyber mb-16" />
        <div ref={StatsRef.ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${StatsRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl border transition-all duration-300 hover:border-violet-500/30 group"
                style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <p className="text-4xl font-black mb-2 gradient-text">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm" style={{ color: '#64748b' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="divider-cyber mt-16" />
      </section>

      {/* ── CATÉGORIES ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div ref={CatRef.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-700 ${CatRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="section-label mx-auto inline-flex mb-4">Univers Yooreed</div>
            <h2 className="section-title mb-4">Nos expertises</h2>
            <p className="max-w-xl mx-auto" style={{ color: '#64748b' }}>
              De la conception à la livraison, nous couvrons tous les aspects de vos événements premium.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CATEGORY_TREE.map((cat, i) => (
              <div
                key={cat.slug}
                className={`transition-all duration-700 ${CatRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Link
                  to={`/catalogue?category=${cat.slug}`}
                  className="group flex flex-col h-full rounded-2xl p-6 border transition-all duration-300 hover:border-violet-500/30 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    borderColor: 'rgba(255,255,255,0.07)',
                    boxShadow: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 8px 24px rgba(124,58,237,0.12)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl text-2xl transition-all duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
                    >
                      {cat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{cat.description}</p>
                    </div>
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                      fill="none" stroke="#a78bfa" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.subCategories.map(sub => (
                      <span key={sub.slug} className="tag-soft text-xs">{sub.label}</span>
                    ))}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUITS PHARES ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={ProdRef.ref} className={`flex items-end justify-between mb-12 transition-all duration-700 ${ProdRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <div className="section-label mb-3">Sélection</div>
              <h2 className="section-title">Nos produits phares</h2>
            </div>
            <Link to="/catalogue" className="btn-ghost hidden md:inline-flex">
              Voir tout le catalogue →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="skeleton h-56" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-4 rounded-full w-3/4" />
                    <div className="skeleton h-3 rounded-full w-full" />
                    <div className="skeleton h-3 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <div
                  key={product._id}
                  className={`product-card transition-all duration-700 ${ProdRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <Link to={`/produit/${product._id}`} className="block">
                    <div className="relative h-52 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.nom}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          Aperçu à venir
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                      {product.prix === 0 && (
                        <span className="absolute top-3 right-3 badge-cyber text-xs">Sur devis</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-white mb-2 line-clamp-1 group-hover:text-violet-300 transition-colors">
                        {product.nom}
                      </h3>
                      <p className="text-sm line-clamp-2 mb-4" style={{ color: '#64748b' }}>{product.description}</p>
                      {product.prix > 0 && (
                        <p className="text-xl font-bold gradient-text-gold mb-4">{product.prix} TND</p>
                      )}
                    </div>
                  </Link>
                  <div className="px-5 pb-5 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 btn-secondary text-sm py-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Panier
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOrder(product, e)}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/catalogue" className="btn-secondary">Voir tout le catalogue</Link>
          </div>
        </div>
      </section>

      {/* ── ÉQUIPE ÉVÉNEMENTIELLE ────────────────────────────────────── */}
      {eventServices.length > 0 && (
        <section className="py-20">
          <div className="divider-cyber mb-20" />
          <div ref={TeamRef.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700 ${TeamRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div>
                <div className="section-label mb-3">Équipe</div>
                <h2 className="section-title mb-3">Task force dédiée</h2>
                <p className="max-w-md" style={{ color: '#64748b' }}>
                  Location d'écrans géants, caméras, régie vidéo et équipe de production pour orchestrer vos moments clés.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Régie vidéo', 'Captation multi-cam', 'Éclairage scénique', 'LED walls'].map(t => (
                    <span key={t} className="tag-cyber text-xs">{t}</span>
                  ))}
                </div>
              </div>
              <Link to="/contact" className="btn-primary self-start md:self-end">Réserver une équipe</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eventServices.slice(0, 3).map((item: any, i: number) => (
                <Link
                  key={item._id}
                  to="/services-evenementiels"
                  className={`group product-card transition-all duration-700 ${TeamRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.titre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        Aperçu à venir
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">{item.titre}</h3>
                    <p className="text-sm line-clamp-3" style={{ color: '#64748b' }}>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="divider-cyber mt-20" />
        </section>
      )}

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────── */}
      <section className="py-20">
        <div ref={TestiRef.ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-700 ${TestiRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="section-label mx-auto inline-flex mb-4">Ils nous font confiance</div>
            <h2 className="section-title">Un partenaire de référence</h2>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${TestiRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
            {[
              { quote: '« Yooreed Events nous accompagne sur nos cérémonies depuis plusieurs années. Les pupitres, trophées et supports sont toujours impeccables et livrés à temps. »', author: 'Responsable communication', company: 'Entreprise B2B Tunis' },
              { quote: '« Une équipe très réactive, capable de gérer des événements complexes avec beaucoup de professionnalisme et de créativité. »', author: 'Directrice générale', company: 'Agence événementielle' },
              { quote: '« Les supports de marque proposés par Yooreed donnent une vraie cohérence visuelle à nos conventions et lancements de produits. »', author: 'Direction marketing', company: 'Secteur services' },
            ].map((t, i) => (
              <div
                key={i}
                className="card card-hover p-6"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4" fill="#F5B544" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: '#94a3b8' }}>{t.quote}</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{t.company}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Logos */}
          <div className={`mt-14 text-center transition-all duration-700 ${TestiRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
            <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: '#334155' }}>Ils nous font confiance</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {['Grands comptes', 'Institutions publiques', 'Agences événementielles', 'Marques internationales'].map(label => (
                <div
                  key={label}
                  className="px-5 py-2.5 rounded-full text-sm font-medium"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)',
        }} />
        <div className="divider-cyber mb-24" />
        <div ref={CtaRef.ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`transition-all duration-700 ${CtaRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="section-label mx-auto inline-flex mb-6">Prêt à créer l'extraordinaire ?</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Votre événement mérite
              <br />
              <span className="gradient-text">le meilleur</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#64748b' }}>
              Parlez-nous de votre projet. Notre équipe vous répond sous 24h avec une proposition sur-mesure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/devis" className="btn-primary px-10 py-4 text-base">
                Demander un devis gratuit
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/contact" className="btn-secondary px-8 py-4 text-base">
                Parler à un expert
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

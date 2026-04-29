import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { useSeo } from '../hooks/useSeo';
import { MOCK_PRODUCTS } from '../data/mockData';
import { CATEGORY_TREE, getCategoryBySlug, getParentCategoryBySubSlug } from '../data/categoryTree';

// ─── Debounce Hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="skeleton h-52" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 rounded-full w-3/4" />
      <div className="skeleton h-3 rounded-full w-full" />
      <div className="skeleton h-3 rounded-full w-2/3" />
      <div className="skeleton h-9 rounded-xl mt-4" />
    </div>
  </div>
);

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Plus récents', sort: 'createdAt', order: 'desc' as const },
  { value: 'createdAt-asc', label: 'Plus anciens', sort: 'createdAt', order: 'asc' as const },
  { value: 'nom-asc', label: 'Nom A → Z', sort: 'nom', order: 'asc' as const },
  { value: 'nom-desc', label: 'Nom Z → A', sort: 'nom', order: 'desc' as const },
  { value: 'prix-asc', label: 'Prix croissant', sort: 'prix', order: 'asc' as const },
  { value: 'prix-desc', label: 'Prix décroissant', sort: 'prix', order: 'desc' as const },
];

// ─── Fuzzy/tolerant search ────────────────────────────────────────────────────
function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  // Simple tolerance: check if 80% of chars from query are in text
  const matched = q.split('').filter(c => t.includes(c)).length;
  return matched / q.length >= 0.75;
}

// ─── Helper: breadcrumb items ─────────────────────────────────────────────────
function getBreadcrumb(categorySlug: string) {
  const mainCat = getCategoryBySlug(categorySlug);
  if (mainCat) return [{ label: mainCat.label, slug: mainCat.slug, isLast: true }];
  const parentCat = getParentCategoryBySubSlug(categorySlug);
  if (parentCat) {
    const subCat = parentCat.subCategories.find(s => s.slug === categorySlug);
    if (subCat) {
      return [
        { label: parentCat.label, slug: parentCat.slug, isLast: false },
        { label: subCat.label, slug: subCat.slug, isLast: true },
      ];
    }
  }
  return [];
}

export const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [_apiCategories, setApiCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSort, setSelectedSort] = useState('createdAt-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [usingMock, setUsingMock] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 350);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useSeo({
    title: 'Catalogue de produits et services événementiels | Yooreed Events',
    description: 'Découvrez le catalogue Yooreed Events : pupitres, trophées, supports de communication, solutions audiovisuelles et services sur-mesure.',
  });

  const sortObj = SORT_OPTIONS.find(o => o.value === selectedSort) || SORT_OPTIONS[0];
  const breadcrumbItems = selectedCategory ? getBreadcrumb(selectedCategory) : [];

  // ── Fetch products ──────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const [productsRes, catsRes] = await Promise.all([
        productService.getAll({
          page: pageNum,
          limit: 12,
          category: selectedCategory || undefined,
          search: debouncedSearch || undefined,
          sort: sortObj.sort,
          order: sortObj.order,
        }),
        pageNum === 1 ? categoryService.getAll() : Promise.resolve(null),
      ]);

      const apiProds = productsRes.data.products || [];
      const pagination = productsRes.data.pagination || { total: 0, totalPages: 1, page: 1 };

      if (catsRes) {
        setApiCategories(catsRes.data.flat || []);
      }

      if (apiProds.length === 0 && pageNum === 1) {
        // Fallback to mock data
        setUsingMock(true);
        let mocked = MOCK_PRODUCTS;
        if (selectedCategory) {
          mocked = mocked.filter(p => p.categorie === selectedCategory || p.sousCategorie === selectedCategory);
        }
        if (debouncedSearch) {
          mocked = mocked.filter(p => fuzzyMatch(p.nom, debouncedSearch) || fuzzyMatch(p.description, debouncedSearch));
        }
        // Sort
        mocked = [...mocked].sort((a, b) => {
          if (sortObj.sort === 'nom') return sortObj.order === 'asc' ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom);
          if (sortObj.sort === 'prix') return sortObj.order === 'asc' ? a.prix - b.prix : b.prix - a.prix;
          return sortObj.order === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt);
        });
        setProducts(mocked);
        setTotalCount(mocked.length);
        setHasMore(false);
      } else {
        setUsingMock(false);
        setProducts(prev => append ? [...prev, ...apiProds] : apiProds);
        setTotalCount(pagination.total || apiProds.length);
        setHasMore(pagination.page < pagination.totalPages);
      }
    } catch {
      if (pageNum === 1) {
        setUsingMock(true);
        const fallback = selectedCategory
          ? MOCK_PRODUCTS.filter(p => p.categorie === selectedCategory || p.sousCategorie === selectedCategory)
          : MOCK_PRODUCTS;
        setProducts(fallback);
        setTotalCount(fallback.length);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, debouncedSearch, sortObj]);

  // Initial fetch + re-fetch on filter changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [selectedCategory, debouncedSearch, selectedSort]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!hasMore || usingMock) return;
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loadingMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, true);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, fetchProducts, usingMock]);

  // Sync search params to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, debouncedSearch, setSearchParams]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(prev => prev === slug ? '' : slug);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchInput('');
    setSelectedSort('createdAt-desc');
  };

  const hasActiveFilters = !!selectedCategory || !!debouncedSearch;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          {/* Breadcrumb */}
          <nav className="breadcrumb mb-4" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">›</span>
            {breadcrumbItems.length === 0 ? (
              <span className="breadcrumb-current">Catalogue</span>
            ) : (
              <>
                <Link to="/catalogue">Catalogue</Link>
                {breadcrumbItems.map((item) => (
                  <span key={item.slug} className="contents">
                    <span className="breadcrumb-sep">›</span>
                    {item.isLast ? (
                      <span className="breadcrumb-current">{item.label}</span>
                    ) : (
                      <Link to={`/catalogue?category=${item.slug}`}>{item.label}</Link>
                    )}
                  </span>
                ))}
              </>
            )}
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {selectedCategory ? (() => {
              const cat = getCategoryBySlug(selectedCategory);
              const parent = getParentCategoryBySubSlug(selectedCategory);
              if (cat) return cat.label;
              if (parent) {
                const sub = parent.subCategories.find(s => s.slug === selectedCategory);
                return sub?.label || 'Catalogue';
              }
              return 'Catalogue';
            })() : 'Catalogue'}
          </h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            {loading ? '…' : `${totalCount} produit${totalCount !== 1 ? 's' : ''} trouvé${totalCount !== 1 ? 's' : ''}`}
            {usingMock && <span className="ml-2 badge-soft text-xs">Démos</span>}
          </p>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar Filters (desktop) ───────────────────────────────── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Recherche</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="#475569" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="catalogue-search"
                    type="search"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Rechercher…"
                    className="input pl-9"
                    autoComplete="off"
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Category tree */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Catégories</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${!selectedCategory ? 'text-violet-300 bg-violet-500/12' : 'text-slate-400 hover:text-slate-200 hover:bg-white/4'}`}
                    style={!selectedCategory ? { border: '1px solid rgba(124,58,237,0.25)' } : { border: '1px solid transparent' }}
                  >
                    Toutes les catégories
                  </button>
                  {CATEGORY_TREE.map(cat => (
                    <div key={cat.slug}>
                      <button
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${selectedCategory === cat.slug ? 'text-violet-300 bg-violet-500/12' : 'text-slate-400 hover:text-slate-200 hover:bg-white/4'}`}
                        style={selectedCategory === cat.slug ? { border: '1px solid rgba(124,58,237,0.25)' } : { border: '1px solid transparent' }}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="line-clamp-1">{cat.label}</span>
                      </button>
                      {/* Sub-categories */}
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {cat.subCategories.map(sub => (
                          <button
                            key={sub.slug}
                            onClick={() => handleCategorySelect(sub.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 ${selectedCategory === sub.slug ? 'text-violet-300 bg-violet-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/3'}`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {hasActiveFilters && (
                <button onClick={handleResetFilters} className="btn-ghost w-full justify-center text-xs">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Top bar: mobile filter toggle + sort */}
            <div className="flex items-center gap-3 mb-6">
              {/* Mobile filter btn */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 btn-ghost text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filtres
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full" style={{ background: '#7C3AED' }} />
                )}
              </button>

              {/* Mobile search (inline) */}
              <div className="flex-1 relative lg:hidden">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="#475569" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Rechercher…"
                  className="input pl-9 text-sm py-2"
                />
              </div>

              {/* Sort */}
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <label className="text-xs whitespace-nowrap" style={{ color: '#64748b' }}>Trier</label>
                <select
                  value={selectedSort}
                  onChange={e => setSelectedSort(e.target.value)}
                  className="select text-sm py-2 w-auto cursor-pointer"
                  style={{ minWidth: '160px' }}
                  id="catalogue-sort"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCategory && (() => {
                  const cat = getCategoryBySlug(selectedCategory);
                  const parent = getParentCategoryBySubSlug(selectedCategory);
                  const label = cat?.label || parent?.subCategories.find(s => s.slug === selectedCategory)?.label || selectedCategory;
                  return (
                    <button onClick={() => setSelectedCategory('')} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                      {label}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  );
                })()}
                {debouncedSearch && (
                  <button onClick={() => setSearchInput('')} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all" style={{ background: 'rgba(0,212,255,0.1)', color: '#67e8f9', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    "{debouncedSearch}"
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            )}

            {/* Products grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <svg className="w-7 h-7" fill="none" stroke="#475569" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-white mb-2">Aucun produit trouvé</p>
                <p className="text-sm mb-6" style={{ color: '#64748b' }}>
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <button onClick={handleResetFilters} className="btn-secondary text-sm">
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="product-card group"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {product.prix === 0 && (
                          <span className="absolute top-3 right-3 badge-cyber text-xs">Sur devis</span>
                        )}
                        {product.gravureLaser && (
                          <span className="absolute top-3 left-3 badge-soft text-xs">Gravure laser</span>
                        )}
                      </div>
                      <div className="p-5 flex-1">
                        <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors leading-tight min-h-[3rem]">
                          {product.nom}
                        </h3>
                        <p className="text-sm mb-3 line-clamp-2 leading-relaxed" style={{ color: '#64748b' }}>
                          {product.description}
                        </p>
                        {product.prix > 0 ? (
                          <p className="text-lg font-bold gradient-text-gold">{product.prix} TND</p>
                        ) : (
                          <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>Prix sur demande</p>
                        )}
                      </div>
                    </Link>
                    <div className="px-5 pb-5 flex gap-2">
                      {product.prix > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 btn-secondary text-sm py-2"
                            aria-label={`Ajouter ${product.nom} au panier`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Panier
                          </button>
                          <Link to={`/produit/${product._id}`} className="flex-1 btn-primary text-sm py-2 justify-center">
                            Voir détails
                          </Link>
                        </>
                      ) : (
                        <Link to={`/devis?produit=${product._id}`} className="w-full btn-primary text-sm py-2 justify-center">
                          Demander un devis
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Infinite scroll loader */}
            {!usingMock && hasMore && (
              <div ref={loaderRef} className="mt-8 flex justify-center py-8">
                {loadingMore ? (
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#64748b' }}>
                    <div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    Chargement…
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ──────────────────────────────────────── */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(5,7,9,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowFilters(false)}
          />
          <div
            className="absolute left-0 top-0 h-full w-80 max-w-full flex flex-col animate-slide-in-left"
            style={{ background: '#080C14', borderRight: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h2 className="text-base font-semibold text-white">Filtres</h2>
              <button onClick={() => setShowFilters(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-5 px-5 space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Trier par</label>
                <select value={selectedSort} onChange={e => setSelectedSort(e.target.value)} className="select text-sm">
                  {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Catégories</label>
                <div className="space-y-1">
                  <button onClick={() => setSelectedCategory('')} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${!selectedCategory ? 'text-violet-300 bg-violet-500/12' : 'text-slate-400 hover:text-slate-200 hover:bg-white/4'}`}>
                    Toutes les catégories
                  </button>
                  {CATEGORY_TREE.map(cat => (
                    <div key={cat.slug}>
                      <button
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${selectedCategory === cat.slug ? 'text-violet-300 bg-violet-500/12' : 'text-slate-400 hover:text-slate-200 hover:bg-white/4'}`}
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </button>
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {cat.subCategories.map(sub => (
                          <button key={sub.slug} onClick={() => handleCategorySelect(sub.slug)} className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 ${selectedCategory === sub.slug ? 'text-violet-300' : 'text-slate-500 hover:text-slate-300'}`}>
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {hasActiveFilters && (
                <button onClick={() => { handleResetFilters(); setShowFilters(false); }} className="btn-ghost w-full justify-center text-sm">Réinitialiser</button>
              )}
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full justify-center">
                Voir les résultats ({totalCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

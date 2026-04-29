import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORY_TREE } from '../data/categoryTree';
import logo from '../../assets/images/logo-yooreedevent.png';

export const Header = () => {
  const { getItemCount } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCatalogueMenu, setShowCatalogueMenu] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemCount = getItemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (itemCount === 0) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 400);
    return () => clearTimeout(t);
  }, [itemCount]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setShowCatalogueMenu(false);
    setMobileExpandedCat(null);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCatalogueMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/services', label: 'Services' },
    { to: '/services-evenementiels', label: 'Équipe Event' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 border-b'
            : 'py-5'
        }`}
        style={{
          background: scrolled
            ? 'rgba(8, 12, 20, 0.92)'
            : 'linear-gradient(180deg, rgba(8,12,20,0.85) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          borderColor: scrolled ? 'rgba(255,255,255,0.06)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <img
                  src={logo}
                  alt="Yooreed Event"
                  className="h-9 w-auto md:h-10 transition-all duration-300 group-hover:opacity-90"
                  loading="eager"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" ref={menuRef}>
              {/* Standard nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.to) && link.to !== '/'
                      ? 'text-white bg-white/8'
                      : 'text-slate-300 hover:text-white hover:bg-white/6'
                  }`}
                  style={isActive(link.to) && link.to !== '/' ? { background: 'rgba(255,255,255,0.08)' } : {}}
                >
                  {link.label}
                </Link>
              ))}

              {/* Catalogue mega-menu trigger */}
              <div
                className="relative"
                onMouseEnter={() => setShowCatalogueMenu(true)}
                onMouseLeave={() => setShowCatalogueMenu(false)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/catalogue')
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/6'
                  }`}
                  style={isActive('/catalogue') ? { background: 'rgba(255,255,255,0.08)' } : {}}
                >
                  Catalogue
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${showCatalogueMenu ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mega Menu */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] transition-all duration-300 ${
                    showCatalogueMenu ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                  onMouseEnter={() => setShowCatalogueMenu(true)}
                  onMouseLeave={() => setShowCatalogueMenu(false)}
                >
                  {/* Arrow */}
                  <div className="flex justify-center mb-1">
                    <div className="w-3 h-3 rotate-45" style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none', borderRight: 'none' }} />
                  </div>
                  <div
                    className="rounded-2xl p-5 border"
                    style={{
                      background: 'rgba(13,17,32,0.97)',
                      backdropFilter: 'blur(32px)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                        Univers Yooreed
                      </p>
                      <Link
                        to="/catalogue"
                        className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                        onClick={() => setShowCatalogueMenu(false)}
                      >
                        Voir tout →
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORY_TREE.map((cat) => (
                        <div key={cat.slug} className="group/cat rounded-xl p-4 transition-all duration-200 hover:bg-white/4 border border-transparent hover:border-white/8">
                          <Link
                            to={`/catalogue?category=${cat.slug}`}
                            className="flex items-start gap-3"
                            onClick={() => setShowCatalogueMenu(false)}
                          >
                            <span className="text-2xl flex-shrink-0 mt-0.5">{cat.icon}</span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white group-hover/cat:text-violet-300 transition-colors leading-tight">
                                {cat.label}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-tight line-clamp-1">
                                {cat.description}
                              </p>
                            </div>
                          </Link>
                          <div className="mt-2.5 flex flex-wrap gap-1.5 pl-10">
                            {cat.subCategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                to={`/catalogue?category=${sub.slug}`}
                                className="text-xs px-2.5 py-1 rounded-full transition-all duration-150"
                                style={{
                                  color: '#64748b',
                                  background: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                }}
                                onMouseEnter={e => {
                                  (e.currentTarget as HTMLElement).style.color = '#c4b5fd';
                                  (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.12)';
                                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.2)';
                                }}
                                onMouseLeave={e => {
                                  (e.currentTarget as HTMLElement).style.color = '#64748b';
                                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                                }}
                                onClick={() => setShowCatalogueMenu(false)}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Desktop CTA + Cart */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Cart */}
              <Link
                to="/panier"
                className={`relative flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 ${
                  cartBump ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                }}
                aria-label={`Panier (${getItemCount()} articles)`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getItemCount() > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold"
                    style={{ background: '#7C3AED', color: '#fff', fontSize: '10px' }}
                  >
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* Devis CTA */}
              <Link to="/devis" className="btn-primary text-sm">
                Demander un devis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/panier"
                className="relative flex items-center justify-center h-9 w-9 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold" style={{ background: '#7C3AED', color: '#fff', fontSize: '10px' }}>
                    {getItemCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200"
                style={{ background: open ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
                aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                <div className="relative w-4 h-4">
                  <span className={`absolute left-0 w-4 h-0.5 bg-current rounded-full transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0.5'}`} />
                  <span className={`absolute left-0 w-4 h-0.5 bg-current rounded-full transition-all duration-300 ${open ? 'opacity-0 top-1.5' : 'top-2'}`} />
                  <span className={`absolute left-0 w-4 h-0.5 bg-current rounded-full transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3.5'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'rgba(5,7,9,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-full flex flex-col transition-transform duration-300 ease-out-expo ${open ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ background: 'rgba(8,12,20,0.98)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <img src={logo} alt="Yooreed" className="h-8 w-auto" />
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to) ? 'text-white bg-violet-500/15' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Catalogue accordéon mobile */}
            <div>
              <button
                onClick={() => setMobileExpandedCat(mobileExpandedCat === 'catalogue' ? null : 'catalogue')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <span>Catalogue</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${mobileExpandedCat === 'catalogue' ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileExpandedCat === 'catalogue' && (
                <div className="mt-1 space-y-1 pl-2">
                  {CATEGORY_TREE.map((cat) => (
                    <div key={cat.slug}>
                      <Link
                        to={`/catalogue?category=${cat.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-violet-300 hover:bg-violet-500/8 transition-colors"
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </Link>
                      <div className="pl-8 space-y-0.5 mb-1">
                        {cat.subCategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            to={`/catalogue?category=${sub.slug}`}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/catalogue"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold mt-2"
                    style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
                  >
                    Voir tout le catalogue →
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* CTA */}
          <div className="px-4 pb-8 pt-4 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <Link
              to="/devis"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Demander un devis
            </Link>
            <Link
              to="/catalogue"
              onClick={() => setOpen(false)}
              className="btn-ghost w-full justify-center"
            >
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo-yooreedevent.png';

// Obfuscated contact data — not readable by scrapers
const OBFUSCATED_EMAIL = 'contact&#64;event&#46;yooreed&#46;com&#46;tn';
const OBFUSCATED_PHONE = '&#43;&#50;&#49;&#54;&#32;&#57;&#56;&#32;&#50;&#49;&#56;&#32;&#56;&#48;&#50;';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#050709' }}>
      {/* Ambient glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(0,212,255,0.3), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-24 pointer-events-none -translate-y-1/2 blur-[60px] opacity-20"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <img src={logo} alt="Yooreed Event" className="h-10 w-auto" />
            <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
              Yooreed Events conçoit et produit des expériences haut de gamme : scénographie, audiovisuel, supports premium et impression grand format en Tunisie.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  href: 'https://www.facebook.com/yooreed.events',
                  label: 'Facebook',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  href: 'https://www.instagram.com/yooreed.events',
                  label: 'Instagram',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                },
                {
                  href: 'https://www.linkedin.com/company/yooreed-events',
                  label: 'LinkedIn',
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)';
                    (e.currentTarget as HTMLElement).style.color = '#a78bfa';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.color = '#64748b';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/catalogue', label: 'Catalogue' },
                { to: '/services', label: 'Services' },
                { to: '/services-evenementiels', label: 'Équipe événementielle' },
                { to: '/contact', label: 'Contact' },
                { to: '/devis', label: 'Demander un devis' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#64748b' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a78bfa'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Nos spécialités</h4>
            <ul className="space-y-3">
              {[
                'Audiovisuel & Scénographie',
                'Impression & Branding',
                'Supports Premium',
                'Équipes & Services',
                'Pupitres & Trophées',
                'Accompagnement événementiel',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm" style={{ color: '#64748b' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — obfusqué */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Email</p>
                {/* Obfuscation via HTML entities */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    // Decode and open mailto on click — not in static HTML
                    const em = atob('Y29udGFjdEBldmVudC55b29yZWVkLmNvbS50bg==');
                    window.location.href = `mailto:${em}`;
                  }}
                  className="text-sm transition-colors duration-200"
                  style={{ color: '#64748b' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a78bfa'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
                  aria-label="Nous envoyer un email"
                  data-obf="true"
                >
                  <span dangerouslySetInnerHTML={{ __html: OBFUSCATED_EMAIL }} />
                </a>
              </li>
              <li>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Téléphone</p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    const tel = atob('KzIxNiA5OCAyMTggODAy');
                    window.location.href = `tel:${tel.replace(/\s/g, '')}`;
                  }}
                  className="text-sm transition-colors duration-200"
                  style={{ color: '#64748b' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a78bfa'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
                  aria-label="Nous appeler"
                  data-obf="true"
                >
                  <span dangerouslySetInnerHTML={{ __html: OBFUSCATED_PHONE }} />
                </a>
              </li>
              <li>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Adresse</p>
                <a
                  href="https://maps.app.goo.gl/3AJW7JgnTe6SeNpv6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-relaxed transition-colors duration-200"
                  style={{ color: '#64748b' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a78bfa'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
                >
                  Novation City, Technopole de Sousse<br />
                  Bâtiment 6000, Sousse 4051, Tunisie
                </a>
              </li>
            </ul>
            <Link
              to="/devis"
              className="btn-primary mt-6 text-sm inline-flex"
            >
              Demander un devis
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs text-center" style={{ color: '#334155' }}>
            © {currentYear} Yooreed Event. Tous droits réservés.
          </p>
          <div className="flex items-center gap-5">
            {[
              { to: '/politique-confidentialite', label: 'Politique de confidentialité' },
              { to: '/cgu', label: 'CGU' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs transition-colors duration-200"
                style={{ color: '#334155' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#334155'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

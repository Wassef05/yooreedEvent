import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type ConsentState = 'accepted' | 'refused' | null;

const STORAGE_KEY = 'yooreed_cookie_consent';
const STORAGE_VERSION = 'v1';

export const CookieBanner = () => {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true, // always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.version === STORAGE_VERSION) {
          setConsent(parsed.consent);
          return;
        }
      } catch {
        // invalid storage, show banner
      }
    }
    // Delay banner appearance for better UX
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const saveConsent = (value: ConsentState, preferences = prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      consent: value,
      preferences,
      timestamp: new Date().toISOString(),
    }));
    setConsent(value);
    setVisible(false);
    setShowPrefs(false);
  };

  const handleAcceptAll = () => {
    const allPrefs = { necessary: true, analytics: true, marketing: true };
    setPrefs(allPrefs);
    saveConsent('accepted', allPrefs);
  };

  const handleRefuse = () => {
    const minPrefs = { necessary: true, analytics: false, marketing: false };
    setPrefs(minPrefs);
    saveConsent('refused', minPrefs);
  };

  const handleSavePrefs = () => {
    saveConsent('accepted', prefs);
  };

  // Don't render if consent already given or banner not visible
  if (consent !== null || !visible) return null;

  return (
    <>
      {/* Overlay when prefs open */}
      {showPrefs && (
        <div
          className="fixed inset-0 z-[60] transition-opacity duration-300"
          style={{ background: 'rgba(5,7,9,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowPrefs(false)}
        />
      )}

      {/* Preferences Modal */}
      {showPrefs && (
        <div
          className="fixed bottom-[calc(1.5rem+160px)] left-1/2 -translate-x-1/2 z-[70] w-full max-w-lg mx-4 rounded-2xl p-6 border animate-fade-in-up"
          style={{
            background: 'rgba(13,17,32,0.99)',
            backdropFilter: 'blur(24px)',
            borderColor: 'rgba(255,255,255,0.12)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
            maxWidth: 'min(100vw - 2rem, 480px)',
          }}
        >
          <h3 className="text-base font-bold text-white mb-4">Préférences de cookies</h3>
          <div className="space-y-4 mb-6">
            {[
              {
                key: 'necessary',
                label: 'Cookies essentiels',
                desc: 'Nécessaires au fonctionnement du site. Toujours actifs.',
                locked: true,
              },
              {
                key: 'analytics',
                label: 'Cookies analytiques',
                desc: 'Nous aident à comprendre l\'utilisation du site (données anonymisées).',
                locked: false,
              },
              {
                key: 'marketing',
                label: 'Cookies marketing',
                desc: 'Permettent de personnaliser les contenus et publicités.',
                locked: false,
              },
            ].map(({ key, label, desc, locked }) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{desc}</p>
                </div>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => !locked && setPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                  className={`relative flex-shrink-0 w-10 h-5.5 rounded-full transition-all duration-200 mt-1 ${locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  style={{
                    background: prefs[key as keyof typeof prefs]
                      ? 'linear-gradient(135deg, #7C3AED, #5b21b6)'
                      : 'rgba(255,255,255,0.1)',
                    width: '40px',
                    height: '22px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  aria-pressed={prefs[key as keyof typeof prefs]}
                  aria-label={label}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm"
                    style={{
                      left: prefs[key as keyof typeof prefs] ? 'calc(100% - 18px)' : '2px',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleSavePrefs} className="btn-primary flex-1 justify-center text-sm py-2">
              Sauvegarder
            </button>
            <button type="button" onClick={() => setShowPrefs(false)} className="btn-ghost text-sm py-2 px-4">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Main Banner */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[65] w-full transition-all duration-500 animate-fade-in-up"
        style={{ maxWidth: 'min(100vw - 2rem, 720px)' }}
      >
        <div
          className="rounded-2xl p-5 sm:p-6 border"
          style={{
            background: 'rgba(13,17,32,0.97)',
            backdropFilter: 'blur(24px)',
            borderColor: 'rgba(255,255,255,0.1)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex gap-3 items-start flex-1 min-w-0">
              {/* Icon */}
              <div
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl mt-0.5"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="#a78bfa" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white mb-1">Ce site utilise des cookies</p>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                  Nous utilisons des cookies pour améliorer votre expérience.{' '}
                  <Link to="/politique-confidentialite" className="underline hover:text-violet-400 transition-colors" style={{ color: '#94a3b8' }}>
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="text-xs px-3 py-2 rounded-lg transition-all duration-200"
                style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e2e8f0'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
              >
                Préférences
              </button>
              <button
                type="button"
                onClick={handleRefuse}
                className="text-xs px-3 py-2 rounded-lg transition-all duration-200"
                style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e2e8f0'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="btn-primary text-xs py-2 px-4"
              >
                Accepter tout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

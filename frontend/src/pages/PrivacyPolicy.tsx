import { useSeo } from '../hooks/useSeo';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
  useSeo({
    title: 'Politique de Confidentialité | Yooreed Events',
    description: 'Consultez la politique de confidentialité de Yooreed Events, conformément au règlement RGPD.',
  });

  const lastUpdated = '29 avril 2025';

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <nav className="breadcrumb mb-4" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Politique de confidentialité</span>
          </nav>
          <div className="section-label mb-4 inline-flex">Légal</div>
          <h1 className="section-title mb-3">Politique de Confidentialité</h1>
          <p className="text-sm" style={{ color: '#475569' }}>Dernière mise à jour : {lastUpdated}</p>
        </div>

        <div className="divider-cyber mb-10" />

        {/* Content */}
        <div className="space-y-10" style={{ color: '#94a3b8', lineHeight: '1.8' }}>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Yooreed Events (ci-après « nous », « notre » ou « la Société »), société basée en Tunisie, est responsable de traitement des données personnelles collectées sur le site <strong className="text-white">events.yooreed.com.tn</strong>.
            </p>
            <p className="mt-3">
              Nous nous engageons à protéger la confidentialité de vos données personnelles et à respecter la réglementation applicable, notamment la loi tunisienne n° 2004-63 du 27 juillet 2004 relative à la protection des données personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Données d\'identification : nom, prénom, société',
                'Données de contact : adresse email, numéro de téléphone, adresse postale',
                'Données de navigation : pages visitées, durée des sessions, adresse IP',
                'Données des formulaires : messages de contact, demandes de devis',
              ].map((item, i) => (
                <li key={i} className="flex items-baseline gap-2.5">
                  <span style={{ color: '#7C3AED', flexShrink: 0 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Finalités du traitement</h2>
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <div className="mt-4 space-y-3">
              {[
                { base: 'Exécution du contrat', desc: 'Traitement de vos commandes et demandes de devis' },
                { base: 'Intérêt légitime', desc: 'Amélioration de nos services et de l\'expérience utilisateur' },
                { base: 'Consentement', desc: 'Envoi de communications marketing (si vous y avez consenti)' },
                { base: 'Obligation légale', desc: 'Conservation des documents comptables et fiscaux' },
              ].map(({ base, desc }, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>{base}</span>
                  <span className="text-sm">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Durée de conservation</h2>
            <p>Nous conservons vos données pendant les durées suivantes :</p>
            <ul className="mt-3 space-y-2">
              {[
                'Données de contact et messages : 3 ans à compter du dernier contact',
                'Données de commande : 10 ans (obligation légale comptable)',
                'Données de navigation : 13 mois maximum',
                'Données marketing : jusqu\'à retrait du consentement',
              ].map((item, i) => (
                <li key={i} className="flex items-baseline gap-2.5">
                  <span style={{ color: '#7C3AED', flexShrink: 0 }}>•</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Vos droits</h2>
            <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { droit: 'Accès', desc: 'Obtenir une copie de vos données' },
                { droit: 'Rectification', desc: 'Corriger des données inexactes' },
                { droit: 'Effacement', desc: 'Demander la suppression de vos données' },
                { droit: 'Opposition', desc: 'Vous opposer au traitement de vos données' },
                { droit: 'Portabilité', desc: 'Recevoir vos données dans un format structuré' },
                { droit: 'Limitation', desc: 'Limiter le traitement de vos données' },
              ].map(({ droit, desc }, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-semibold text-white">{droit}</p>
                  <p className="text-xs mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Pour exercer vos droits, contactez-nous à :{' '}
              <button onClick={() => window.location.href = 'mailto:' + atob('Y29udGFjdEBldmVudC55b29yZWVkLmNvbS50bg==')} className="underline hover:text-violet-300 transition-colors" style={{ color: '#a78bfa' }}>
                contact&#64;event&#46;yooreed&#46;com&#46;tn
              </button>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Cookies</h2>
            <p>Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences via le bandeau de cookies affiché lors de votre première visite.</p>
            <p className="mt-3 text-sm">Types de cookies utilisés :</p>
            <ul className="mt-2 space-y-1">
              {[
                'Cookies essentiels (session, sécurité) — toujours actifs',
                'Cookies analytiques — avec votre consentement',
                'Cookies marketing — avec votre consentement',
              ].map((item, i) => (
                <li key={i} className="flex items-baseline gap-2.5 text-sm">
                  <span style={{ color: '#7C3AED', flexShrink: 0 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation, notamment : chiffrement HTTPS/TLS, contrôle d'accès aux systèmes, et pseudonymisation des données sensibles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour.
            </p>
          </section>
        </div>

        <div className="divider-cyber mt-10 mb-8" />
        <div className="flex flex-wrap gap-4">
          <Link to="/cgu" className="btn-ghost text-sm">Lire les CGU →</Link>
          <Link to="/contact" className="btn-ghost text-sm">Exercer mes droits →</Link>
        </div>
      </div>
    </div>
  );
};

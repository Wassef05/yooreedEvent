import { useSeo } from '../hooks/useSeo';
import { Link } from 'react-router-dom';

export const CGU = () => {
  useSeo({
    title: 'Conditions Générales d\'Utilisation | Yooreed Events',
    description: 'Consultez les conditions générales d\'utilisation du site Yooreed Events.',
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
            <span className="breadcrumb-current">Conditions Générales d'Utilisation</span>
          </nav>
          <div className="section-label mb-4 inline-flex">Légal</div>
          <h1 className="section-title mb-3">Conditions Générales d'Utilisation</h1>
          <p className="text-sm" style={{ color: '#475569' }}>Dernière mise à jour : {lastUpdated}</p>
        </div>

        <div className="divider-cyber mb-10" />

        <div className="space-y-10" style={{ color: '#94a3b8', lineHeight: '1.8' }}>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du site web{' '}
              <strong className="text-white">events.yooreed.com.tn</strong> (ci-après « le Site »), édité par la société Yooreed Events, dont le siège social est situé à Novation City, Technopole de Sousse, Bâtiment 6000, Sousse 4051, Tunisie.
            </p>
            <p className="mt-3">
              Toute utilisation du Site implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Accès au service</h2>
            <p>
              Le Site est accessible 24h/24 et 7j/7, sauf en cas de force majeure, de maintenance programmée ou de toute circonstance indépendante de notre volonté.
            </p>
            <p className="mt-3">
              Yooreed Events se réserve le droit de suspendre, modifier ou interrompre l'accès au Site à tout moment, sans préavis ni indemnité.
            </p>
            <p className="mt-3">
              L'utilisation du Site est réservée à des fins personnelles et non commerciales. Toute utilisation à des fins commerciales sans autorisation préalable écrite de Yooreed Events est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant le Site (textes, images, graphismes, logotypes, icônes, sons, logiciels, etc.) est la propriété exclusive de Yooreed Events ou de ses partenaires et est protégé par les lois tunisiennes et internationales relatives à la propriété intellectuelle.
            </p>
            <p className="mt-3">
              Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, du contenu du Site, par quelque procédé que ce soit, sans l'autorisation préalable et écrite de Yooreed Events, est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Responsabilité</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-semibold text-white mb-2">4.1 Limitation de responsabilité</h3>
                <p className="text-sm">
                  Yooreed Events s'efforce de maintenir des informations exactes et à jour sur le Site. Cependant, la Société ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées. En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa propre responsabilité.
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-semibold text-white mb-2">4.2 Liens hypertextes</h3>
                <p className="text-sm">
                  Le Site peut contenir des liens vers des sites tiers. Yooreed Events n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques en matière de protection des données personnelles.
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-semibold text-white mb-2">4.3 Force majeure</h3>
                <p className="text-sm">
                  Yooreed Events ne saurait être tenu responsable de tout dommage résultant d'une interruption ou d'un dysfonctionnement du Site dus à un cas de force majeure, une panne des réseaux de télécommunication ou toute autre circonstance extérieure.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Comportement de l'utilisateur</h2>
            <p>L'utilisateur s'engage à :</p>
            <ul className="mt-3 space-y-2">
              {[
                'Ne pas utiliser le Site à des fins illicites ou contraires aux présentes CGU',
                'Ne pas tenter d\'accéder sans autorisation à d\'autres systèmes ou réseaux',
                'Ne pas transmettre de données susceptibles d\'endommager le Site ou ses utilisateurs',
                'Ne pas collecter ou utiliser illégalement les données des autres utilisateurs',
                'Ne pas perturber ou interrompre les services du Site',
                'Respecter les droits de propriété intellectuelle de Yooreed Events',
              ].map((item, i) => (
                <li key={i} className="flex items-baseline gap-2.5 text-sm">
                  <span className="flex-shrink-0" style={{ color: '#7C3AED' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Commandes et devis</h2>
            <p>
              Les informations présentées sur le Site constituent une invitation à effectuer une offre d'achat et non une offre ferme. Les prix et disponibilités sont susceptibles d'évoluer. Toute commande ou demande de devis est soumise à confirmation expresse de Yooreed Events.
            </p>
            <p className="mt-3">
              Yooreed Events se réserve le droit de refuser toute commande sans avoir à justifier sa décision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Protection des données personnelles</h2>
            <p>
              Les données personnelles collectées sur le Site sont traitées conformément à notre{' '}
              <Link to="/politique-confidentialite" className="underline hover:text-violet-300 transition-colors" style={{ color: '#a78bfa' }}>
                Politique de Confidentialité
              </Link>
              , disponible sur cette même page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGU sont soumises au droit tunisien. En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les tribunaux compétents seront ceux de Sousse, Tunisie, sauf disposition légale contraire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">9. Modifications des CGU</h2>
            <p>
              Yooreed Events se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site. L'utilisation du Site après modification vaut acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">10. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
            </p>
            <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm"><strong className="text-white">Yooreed Events</strong></p>
              <p className="text-sm mt-1">Novation City, Technopole de Sousse, Bâtiment 6000, Sousse 4051, Tunisie</p>
              <p className="text-sm mt-1">
                Email :{' '}
                <button
                  onClick={() => window.location.href = 'mailto:' + atob('Y29udGFjdEBldmVudC55b29yZWVkLmNvbS50bg==')}
                  className="underline hover:text-violet-300 transition-colors"
                  style={{ color: '#a78bfa' }}
                >
                  contact&#64;event&#46;yooreed&#46;com&#46;tn
                </button>
              </p>
            </div>
          </section>
        </div>

        <div className="divider-cyber mt-10 mb-8" />
        <div className="flex flex-wrap gap-4">
          <Link to="/politique-confidentialite" className="btn-ghost text-sm">Politique de confidentialité →</Link>
          <Link to="/contact" className="btn-ghost text-sm">Nous contacter →</Link>
        </div>
      </div>
    </div>
  );
};

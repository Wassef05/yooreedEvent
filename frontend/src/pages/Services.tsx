import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export const Services = () => {
  useSeo({
    title: 'Services événementiels & audiovisuels | Yooreed Events',
    description:
      'Découvrez les services Yooreed Events : impression grand format, scénographie, location d’écrans géants LED et captation vidéo professionnelle en Tunisie.',
  });

  const printServices = [
    {
      title: "Impression de Roll-ups Personnalisés",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: "Le roll-up est un outil indispensable pour tout événement professionnel. Facile à installer, il offre une visibilité maximale. Nous proposons des modèles robustes avec impression HD.",
      features: ["Support stable et durable", "Impression quadrichromie haute résolution", "Housse de transport incluse", "Service de design graphique disponible"],
      link: "/devis"
    },
    {
      title: "Impression de Banderoles sur Mesure",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      description: "Pour une communication grand format, la banderole est la solution idéale. Annoncez votre événement ou décorez votre stand avec des matériaux résistants (PVC, tissu).",
      features: ["Adapté pour l'intérieur et l'extérieur", "Large choix de matériaux et finitions", "Impression résistante aux UV", "Formats personnalisables"],
      link: "/contact"
    }
  ];

  const avServices = [
    {
      title: "Location d'Écrans Géants LED",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: "Transformez votre événement en expérience immersive. Nos écrans LED offrent une luminosité exceptionnelle, même en plein jour, pour conférences et concerts.",
      features: ["Écrans modulables toutes tailles", "Haute résolution (P2.6, P3.9)", "Installation et support technique", "Usage intérieur et extérieur"],
      link: "/contact"
    },
    {
      title: "Prestation Vidéo et Captation",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      description: "Immortalisez vos moments clés avec notre captation 4K. Streaming live, vidéos souvenirs ou enregistrements de conférences avec régie multicam.",
      features: ["Équipe de tournage pro", "Matériel 4K dernière génération", "Gestion de live streaming", "Post-production & montage"],
      link: "/contact"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(124,58,237,0.15) 0%, transparent 50%)',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-6 inline-flex section-label mx-auto">Expertise Yooreed</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white leading-tight">
            Des Solutions <span className="gradient-text">Complètes</span> pour Vos Événements
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            Chez Yooreed Events, nous sommes votre partenaire privilégié pour assurer le succès de vos conférences, séminaires et événements corporate. Découvrez nos services d'impression sur-mesure et nos solutions audiovisuelles de pointe.
          </p>
        </div>
      </section>

      {/* Impression */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto mb-4 inline-flex">Branding</div>
            <h2 className="section-title">Supports Visuels Haute Qualité</h2>
            <p className="max-w-2xl mx-auto mt-4 text-slate-500">
              La communication visuelle est la clé. Nous assurons le design et l'impression de supports percutants pour renforcer votre image de marque.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {printServices.map((svc, i) => (
              <div key={i} className="card p-8 group hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-violet-400"
                    style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {svc.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                    {svc.title}
                  </h3>
                </div>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {svc.description}
                </p>
                <ul className="space-y-4 mb-10">
                  {svc.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-slate-500">
                      <span className="text-violet-500 mt-1">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={svc.link} className="btn-primary w-full justify-center">
                  Demander un Devis
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-cyber my-10" />

      {/* Audiovisuel */}
      <section className="py-20 relative">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 80% 60%, rgba(0,212,255,0.1) 0%, transparent 50%)',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mx-auto mb-4 inline-flex">Audiovisuel</div>
            <h2 className="section-title">Technologie & Expertise</h2>
            <p className="max-w-2xl mx-auto mt-4 text-slate-500">
              L'impact de votre événement dépend de la qualité de sa diffusion. Captivez votre audience avec nos solutions professionnelles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {avServices.map((svc, i) => (
              <div key={i} className="card p-8 group hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-cyber-400"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    {svc.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyber-300 transition-colors">
                    {svc.title}
                  </h3>
                </div>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {svc.description}
                </p>
                <ul className="space-y-4 mb-10">
                  {svc.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-slate-500">
                      <span className="text-cyber-500 mt-1">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={svc.link} className="btn-cyber w-full justify-center">
                  Réserver cet équipement
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 relative overflow-hidden">
        <div className="divider-cyber mb-24" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-8">Prêt à Donner Vie à Votre Événement ?</h2>
          <p className="text-xl text-slate-400 mb-10">
            Contactez-nous dès aujourd'hui pour transformer votre vision en succès mémorable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/devis" className="btn-primary px-10 py-4 text-base">
              Obtenir un devis gratuit
            </Link>
            <Link to="/contact" className="btn-secondary px-10 py-4 text-base">
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

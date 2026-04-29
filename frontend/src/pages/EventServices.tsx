import { useEffect, useState } from 'react';
import { eventServiceApi } from '../services/eventService';
import { useSeo } from '../hooks/useSeo';
import { Link } from 'react-router-dom';

type EventService = {
  _id: string;
  titre: string;
  description: string;
  features: string[];
  images: string[];
  slug: string;
};

export const EventServices = () => {
  const [services, setServices] = useState<EventService[]>([]);
  const [loading, setLoading] = useState(true);

  useSeo({
    title: 'Équipe événementielle & captation | Yooreed Events',
    description:
      'Location d’écrans géants, caméras, régie vidéo, éclairage et équipe de production Yooreed pour orchestrer vos moments clés en Tunisie.',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await eventServiceApi.listPublic();
        setServices(res.data.services || []);
      } catch (err) {
        console.error("Erreur lors du chargement des services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 space-y-4">
          <div className="section-label inline-flex">Task Force</div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Équipe de <span className="gradient-text">Production</span> Dédiée
          </h1>
          <p className="text-slate-400 max-w-3xl text-lg leading-relaxed">
            Location d'écrans géants, caméras, régie vidéo, éclairage scénique et équipe de production 
            pour orchestrer vos moments clés avec une fluidité absolue.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Régie vidéo', 'Captation multicam', 'Éclairage', 'Mapping', 'Live Streaming'].map(tag => (
              <span key={tag} className="tag-cyber text-xs">{tag}</span>
            ))}
          </div>
        </div>

        <div className="divider-cyber mb-12" />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card h-96 overflow-hidden">
                <div className="skeleton h-60 w-full" />
                <div className="p-6 space-y-4">
                  <div className="skeleton h-6 w-3/4 rounded-full" />
                  <div className="skeleton h-4 w-full rounded-full" />
                  <div className="skeleton h-4 w-1/2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl border border-white/5">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Aucun service disponible</h3>
            <p className="text-slate-500 mb-8">Nos équipes sont actuellement sur le terrain. Contactez-nous pour vos besoins spécifiques.</p>
            <Link to="/contact" className="btn-primary">Nous contacter</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <div
                key={svc._id}
                className="group product-card p-0 overflow-hidden flex flex-col"
              >
                <div className="relative h-72 bg-navy-900 overflow-hidden">
                  {svc.images?.[0] ? (
                    <img
                      src={svc.images[0]}
                      alt={svc.titre}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-600 text-sm">
                      Aperçu bientôt
                    </div>
                  )}
                  {/* Layer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60" />
                  
                  {/* Badge floating */}
                  <div className="absolute top-4 right-4 badge-cyber text-[10px]">
                    Service Premium
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-violet-300 transition-colors">
                      {svc.titre}
                    </h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {svc.description}
                    </p>
                    
                    {svc.features?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {svc.features.map((f) => (
                          <span 
                            key={f} 
                            className="text-[10px] px-2.5 py-1 rounded-md font-semibold tracking-wider uppercase"
                            style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/devis?service=${svc._id}`}
                    className="btn-primary w-full justify-center group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  >
                    Réserver l'équipe
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partenaire CTA */}
        <div className="mt-24 p-12 rounded-[40px] text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(8,12,20,1) 0%, rgba(20,15,40,1) 100%)', border: '1px solid rgba(124,58,237,0.1)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" style={{ background: '#7C3AED' }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Besoin d'un accompagnement complet ?</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
              De la conception technique à la réalisation le jour J, nos experts vous accompagnent pour garantir un impact maximal auprès de votre audience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="btn-secondary px-8 py-3">Discuter avec un expert</Link>
              <Link to="/devis" className="btn-primary px-8 py-3">Demander un chiffrage</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

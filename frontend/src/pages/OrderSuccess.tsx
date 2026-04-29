import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export const OrderSuccess = () => {
  useSeo({
    title: 'Commande validée | Yooreed Events',
    description: 'Votre commande a été enregistrée avec succès. Merci de votre confiance.',
  });

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center relative overflow-hidden" style={{ background: '#080C14' }}>
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-500/10 blur-[120px] rounded-full animate-pulse" />

      <div className="max-w-xl mx-auto px-6 relative z-10 text-center">
        {/* Success Icon Animation */}
        <div className="mb-10 relative inline-block">
          <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center relative">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Merci pour votre confiance !</h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          Votre commande a été <span className="text-green-400 font-bold">validée avec succès</span>. 
          Notre équipe logistique prépare déjà vos équipements pour votre événement.
        </p>

        <div className="card p-8 mb-10 text-left">
          <h3 className="text-lg font-bold text-white mb-4">Prochaines étapes :</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
              <span>Vous allez recevoir un email récapitulatif de votre commande.</span>
            </li>
            <li className="flex gap-3 text-sm text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
              <span>Un conseiller Yooreed Events vous contactera pour organiser la livraison.</span>
            </li>
            <li className="flex gap-3 text-sm text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
              <span>La facture électronique sera disponible dans votre espace client.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/catalogue" className="btn-primary px-8">Continuer mes achats</Link>
          <Link to="/" className="btn-secondary px-8">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

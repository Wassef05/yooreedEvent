import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export const QuoteSuccess = () => {
  useSeo({
    title: 'Demande de devis envoyée | Yooreed Events',
    description: 'Votre demande de devis a été transmise à nos experts. Nous vous répondrons sous 24h.',
  });

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center relative overflow-hidden" style={{ background: '#080C14' }}>
      {/* Background accents */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyber-500/10 blur-[100px] rounded-full" />
      
      <div className="max-w-xl mx-auto px-6 relative z-10 text-center">
        {/* Quote Icon Animation */}
        <div className="mb-10 relative inline-block">
          <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="w-24 h-24 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center relative">
            <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Demande enregistrée</h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          Merci d'avoir choisi <span className="text-white font-bold">Yooreed Events</span>. 
          Nos experts étudient votre projet pour vous proposer la solution la plus adaptée.
        </p>

        <div className="glass-panel p-8 mb-10 border border-white/5 rounded-[32px] text-left">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyber-500/10 flex items-center justify-center text-cyber-400 border border-cyber-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-white font-bold">Réponse garantie sous 24h</p>
              <p className="text-xs text-slate-500">Nos conseillers travaillent sur votre chiffrage.</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Un email de confirmation vient de vous être envoyé. Si vous ne le recevez pas d'ici quelques minutes, 
            pensez à vérifier vos courriers indésirables ou contactez-nous directement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/catalogue" className="btn-cyber px-10">Parcourir d'autres solutions</Link>
          <Link to="/services" className="btn-secondary px-10">Nos prestations</Link>
        </div>
      </div>
    </div>
  );
};

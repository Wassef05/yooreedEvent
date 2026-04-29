import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSeo } from '../../hooks/useSeo';

interface Quote {
  _id: string;
  numeroDevis: string;
  client: {
    nom: string;
    societe: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  produits: Array<{
    produitId: any;
    quantite: number;
    besoinsSpecifiques: string;
  }>;
  statut: 'en_cours' | 'traite';
  notes: string;
  createdAt: string;
}

export const QuotesManagement = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [notes, setNotes] = useState('');

  useSeo({
    title: 'Suivi Devis | Administration Yooreed Events',
  });

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  useEffect(() => {
    if (selectedQuote) {
      setNotes(selectedQuote.notes || '');
    }
  }, [selectedQuote]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const params = filter ? { statut: filter } : {};
      const response = await api.get('/quotes', { params });
      setQuotes(response.data.data.quotes || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await api.put(`/quotes/${quoteId}/status`, {
        statut: newStatus,
        notes: notes,
      });
      fetchQuotes();
      if (selectedQuote?._id === quoteId) {
        setSelectedQuote({ ...selectedQuote, statut: newStatus as any, notes });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuote) return;
    try {
      await api.put(`/quotes/${selectedQuote._id}/status`, {
        statut: selectedQuote.statut,
        notes: notes,
      });
      setSelectedQuote({ ...selectedQuote, notes });
      alert('Notes internes sauvegardées');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Expertise Devis</h1>
          <p className="text-slate-500 mt-2">Chiffrage et accompagnement des projets clients.</p>
        </div>
        
        <div className="relative group">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest absolute -top-5 left-1">Pipeline</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input bg-white/5 border-white/5 py-3 px-6 pr-10 text-xs font-bold uppercase tracking-wider dark:bg-[#0A0E17]"
            style={{ appearance: 'none' }}
          >
            <option value="">Tous les devis</option>
            <option value="en_cours">En attente d'étude</option>
            <option value="traite">Chiffrage terminé</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table Area */}
        <div className={`lg:col-span-2 transition-all duration-500 ${selectedQuote ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
          <div className="card p-0 overflow-hidden border-white/5 bg-[#080C14]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Référence</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Contact</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Projet</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Statut</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    [1,2,3,4].map(i => <tr key={i}><td colSpan={5} className="px-6 py-8"><div className="skeleton h-10 w-full" /></td></tr>)
                  ) : quotes.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-600 italic">Aucune demande de devis dans cette section.</td></tr>
                  ) : quotes.map((quote) => (
                    <tr 
                      key={quote._id} 
                      className={`hover:bg-white/[0.02] transition-all cursor-pointer group ${selectedQuote?._id === quote._id ? 'bg-violet-600/5' : ''}`}
                      onClick={() => setSelectedQuote(quote)}
                    >
                      <td className="px-6 py-5 font-mono text-xs text-white/40 group-hover:text-violet-400">
                        QT-{quote.numeroDevis}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{quote.client.nom}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{quote.client.societe || 'Particulier'}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-slate-400">{quote.produits.length} article(s)</p>
                      </td>
                      <td className="px-6 py-5">
                        <span 
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border ${
                            quote.statut === 'en_cours' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                          }`}
                        >
                          {quote.statut === 'en_cours' ? 'EN ATTENTE' : 'FINALISÉ'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="text-[10px] font-black uppercase tracking-widest text-violet-400 group-hover:text-white transition-colors">Examiner →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel Details */}
        {selectedQuote && (
          <div className="lg:col-span-1 animate-fadeInUp">
            <div className="card p-8 sticky top-24 border-violet-500/20 bg-[#0A0E17] shadow-xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  Solution {selectedQuote.numeroDevis}
                </h2>
                <button onClick={() => setSelectedQuote(null)} className="text-slate-600 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-8 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Contact Section */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Client Prospect</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-bold text-white">{selectedQuote.client.nom}</p>
                    <p className="text-violet-400 font-medium">@{selectedQuote.client.email}</p>
                    <p className="text-slate-500">📍 {selectedQuote.client.adresse}</p>
                    <p className="text-slate-500">📞 {selectedQuote.client.telephone}</p>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                  <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Besoin Précis</h3>
                  <div className="space-y-3">
                    {selectedQuote.produits.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                        <div className="flex justify-between font-bold text-white text-xs mb-2">
                          <span>{item.produitId?.nom || 'Article inconnu'}</span>
                          <span className="text-violet-500">x{item.quantite}</span>
                        </div>
                        {item.besoinsSpecifiques && (
                          <div className="text-[10px] text-slate-400 bg-white/5 p-2 rounded-lg leading-relaxed">
                            "{item.besoinsSpecifiques}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Internes */}
                <div className="space-y-3">
                  <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Journal d'Expertise</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Ajouter des notes techniques ou commerciales..."
                    className="textarea text-xs"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                  >
                    Sauvegarder les notes
                  </button>
                </div>

                {/* Status Switcher */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Progression du Dossier</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(selectedQuote._id, 'en_cours')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedQuote.statut === 'en_cours' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-white/5 text-slate-600 hover:text-white'}`}
                    >
                      En Étude
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedQuote._id, 'traite')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedQuote.statut === 'traite' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-white/5 text-slate-600 hover:text-white'}`}
                    >
                      Chiffré
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

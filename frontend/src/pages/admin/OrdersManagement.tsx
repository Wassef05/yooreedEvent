import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSeo } from '../../hooks/useSeo';

interface Order {
  _id: string;
  numeroCommande: string;
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
    prixUnitaire: number;
    personnalisation?: string;
  }>;
  total: number;
  statut: 'en_attente' | 'en_traitement' | 'expediee' | 'annulee';
  instructions: string;
  createdAt: string;
}

export const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('');

  useSeo({
    title: 'Suivi Commandes | Administration Yooreed Events',
  });

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter ? { statut: filter } : {};
      const response = await api.get('/orders', { params });
      setOrders(response.data.data.orders || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { statut: newStatus });
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, statut: newStatus as any });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statusConfig: Record<string, { label: string, color: string, glow: string }> = {
    en_attente: { label: 'EN ATTENTE', color: '#F59E0B', glow: 'rgba(245,158,11,0.1)' },
    en_traitement: { label: 'EN COURS', color: '#3B82F6', glow: 'rgba(59,130,246,0.1)' },
    expediee: { label: 'EXPÉDIÉE', color: '#10B981', glow: 'rgba(16,185,129,0.1)' },
    annulee: { label: 'ANNULÉE', color: '#EF4444', glow: 'rgba(239,68,68,0.1)' },
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gestion Logistique</h1>
          <p className="text-slate-500 mt-2">Suivi et expédition des commandes clients.</p>
        </div>
        
        {/* Modern Filter Dropdown */}
        <div className="relative group">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest absolute -top-5 left-1">Filtre Rapide</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input bg-white/5 border-white/5 py-3 px-6 pr-10 text-xs font-bold uppercase tracking-wider dark:bg-[#0A0E17]"
            style={{ appearance: 'none' }}
          >
            <option value="">Tous les flux</option>
            <option value="en_attente">En attente</option>
            <option value="en_traitement">En traitement</option>
            <option value="expediee">Expédiées</option>
            <option value="annulee">Annulées</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table Column */}
        <div className={`lg:col-span-2 transition-all duration-500 ${selectedOrder ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
          <div className="card p-0 overflow-hidden border-white/5 bg-[#080C14]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">ID Unique</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Client</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Montant</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Flux / Statut</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    [1,2,3,4,5].map(i => <tr key={i}><td colSpan={5} className="px-6 py-8"><div className="skeleton h-10 w-full" /></td></tr>)
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-600 italic">Aucune commande enregistrée dans ce flux.</td></tr>
                  ) : orders.map((order) => (
                    <tr 
                      key={order._id} 
                      className={`hover:bg-white/[0.02] transition-all cursor-pointer group ${selectedOrder?._id === order._id ? 'bg-violet-600/5' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-5 font-mono text-xs text-white/40 group-hover:text-violet-400 transition-colors">
                        #{order.numeroCommande}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{order.client.nom}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{order.client.email}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-white">{order.total} <span className="text-[10px] text-slate-600 uppercase">Tnd</span></span>
                      </td>
                      <td className="px-6 py-5">
                        <span 
                          className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border"
                          style={{ 
                            color: statusConfig[order.statut]?.color, 
                            borderColor: statusConfig[order.statut]?.color + '40',
                            background: statusConfig[order.statut]?.glow
                          }}
                        >
                          {statusConfig[order.statut]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="text-[10px] font-black uppercase tracking-widest text-violet-400 group-hover:text-white transition-colors">Détails →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Floating Detail Panel */}
        {selectedOrder && (
          <div className="lg:col-span-1 animate-fadeInUp">
            <div className="card p-8 sticky top-24 border-violet-500/20 bg-[#0A0E17] shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter items-center flex gap-2">
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ background: statusConfig[selectedOrder.statut]?.color }} />
                  Détail #{selectedOrder.numeroCommande}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-600 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Section Client */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Expédition Vers</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-bold text-white">{selectedOrder.client.nom}</p>
                    {selectedOrder.client.societe && <p className="text-violet-400 font-medium">🏢 {selectedOrder.client.societe}</p>}
                    <p className="text-slate-400">{selectedOrder.client.adresse}</p>
                    <p className="text-slate-400">📞 {selectedOrder.client.telephone}</p>
                  </div>
                </div>

                {/* Section Produits */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Articles Commandés</h3>
                  <div className="space-y-2">
                    {selectedOrder.produits.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between font-bold text-white text-sm mb-1">
                          <span>{item.produitId?.nom || 'Article indisponible'}</span>
                          <span className="text-violet-400">x{item.quantite}</span>
                        </div>
                        <p className="text-[10px] text-slate-600">{item.prixUnitaire} TND / unité</p>
                        {item.personnalisation && (
                          <div className="mt-2 text-[10px] bg-white/5 p-2 rounded-lg italic text-slate-400">
                            " {item.personnalisation} "
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Summary */}
                <div className="flex justify-between items-center p-4 border-t border-b border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Facturé</span>
                  <span className="text-2xl font-black text-white">{selectedOrder.total} <span className="text-[10px] text-slate-600">TND</span></span>
                </div>

                {/* Status Control */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Piloter le flux</h3>
                  <select
                    value={selectedOrder.statut}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="input w-full py-4 px-6 dark:bg-[#0A0E17]"
                  >
                    <option value="en_attente">Marquer: En attente</option>
                    <option value="en_traitement">Lancer Traitement</option>
                    <option value="expediee">Confirmer Expédition</option>
                    <option value="annulee">Annuler la transaction</option>
                  </select>
                  <p className="text-[9px] text-center text-slate-700 italic">La modification du statut sera notifiée au client.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

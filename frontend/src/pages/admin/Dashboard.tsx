import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useSeo } from '../../hooks/useSeo';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    quotes: 0,
    categories: 0,
    eventServices: 0
  });
  const [loading, setLoading] = useState(true);

  useSeo({
    title: 'Tableau de bord | Administration Yooreed Events',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, quotesRes, categoriesRes, eventRes] = await Promise.all([
          api.get('/products?limit=1'),
          api.get('/orders?limit=1'),
          api.get('/quotes?limit=1'),
          api.get('/categories'),
          api.get('/event-services')
        ]);

        setStats({
          products: productsRes.data.data.pagination?.total || 0,
          orders: ordersRes.data.data.pagination?.total || 0,
          quotes: quotesRes.data.data.pagination?.total || 0,
          categories: categoriesRes.data.data.flat?.length || 0,
          eventServices: eventRes.data.services?.length || 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Produits', 
      value: stats.products, 
      link: '/admin/products', 
      color: 'rgba(124,58,237,0.1)', 
      border: 'rgba(124,58,237,0.3)',
      text: '#a78bfa',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
      )
    },
    { 
      label: 'Catégories', 
      value: stats.categories, 
      link: '/admin/categories', 
      color: 'rgba(5,150,105,0.1)', 
      border: 'rgba(5,150,105,0.3)',
      text: '#34d399',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
      )
    },
    { 
      label: 'Commandes', 
      value: stats.orders, 
      link: '/admin/orders', 
      color: 'rgba(217,119,6,0.1)', 
      border: 'rgba(217,119,6,0.3)',
      text: '#fbbf24',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 21z" /></svg>
      )
    },
    { 
      label: 'Devis', 
      value: stats.quotes, 
      link: '/admin/quotes', 
      color: 'rgba(0,212,255,0.1)', 
      border: 'rgba(0,212,255,0.3)',
      text: '#22d3ee',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      )
    },
  ];

  return (
    <div className="p-2">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Tableau de Bord</h1>
        <p className="text-slate-500 mt-2">Bienvenue sur le centre de contrôle Yooreed Events.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card h-40 animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              style={{ background: '#0A0E17', borderColor: 'rgba(255,255,255,0.05)' }}
            >
              {/* Accents lumineux */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2" 
                style={{ background: card.text }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
                    style={{ background: card.color, border: `1px solid ${card.border}`, color: card.text }}>
                    {card.icon}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-tighter text-slate-700">Live Data</div>
                </div>
                
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white">{card.value}</p>
                  <span className="text-[10px] font-medium text-slate-600">Entrées</span>
                </div>
              </div>

              {/* Barre de progression décorative */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Ajouter un Produit', icon: 'M12 4v16m8-8H4', link: '/admin/products' },
            { label: 'Voir les Devis', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', link: '/admin/quotes' },
            { label: 'Gestion Équipe', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', link: '/admin/event-services' },
          ].map((action, i) => (
            <Link key={i} to={action.link} className="glass-panel p-6 flex items-center gap-4 hover:bg-white/[0.03] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-violet-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} /></svg>
              </div>
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

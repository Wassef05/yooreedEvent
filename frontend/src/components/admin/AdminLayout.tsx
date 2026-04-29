import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await authService.getMe();
        setAdmin(response.data.admin);
      } catch (error) {
        authService.logout();
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { 
      path: '/admin', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
      )
    },
    { 
      path: '/admin/products', 
      label: 'Catalogue', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
      )
    },
    { 
      path: '/admin/categories', 
      label: 'Catégories', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
      )
    },
    { 
      path: '/admin/orders', 
      label: 'Commandes', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2zM5 9h14l1 12H4L5 9z" /></svg>
      )
    },
    { 
      path: '/admin/quotes', 
      label: 'Devis', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      )
    },
    { 
      path: '/admin/event-services', 
      label: 'Prestations', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      )
    },
    { 
      path: '/admin/profile', 
      label: 'Profil', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      )
    }
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#05080F' }}>
      
      {/* Sidebar Overlay (Mobile) */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 transform lg:translate-x-0 ${
          isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ background: '#080C14', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-8">
            <Link to="/" className="flex flex-col items-start group">
              <span className="text-xl font-black text-white group-hover:text-violet-400 transition-colors">
                YOOREED <span className="text-violet-500">EVENTS</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mt-1">Admin Dashboard</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={`mr-4 transition-colors ${isActive ? 'text-violet-500' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,1)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-6 border-t border-white/5 space-y-6">
            {admin && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-black border border-violet-500/20">
                  {admin.username?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{admin.username}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Administrateur</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4-4H3" /></svg>
                </button>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full bg-white/[0.03] hover:bg-red-500/10 text-slate-400 hover:text-red-400 py-3 rounded-xl text-xs font-bold transition-all border border-white/5 hover:border-red-500/20"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#05080F]/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest flex items-center gap-2">
              Voir le Site
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
          </div>
        </header>

        {/* Content Content Content */}
        <main className="flex-grow p-8 text-white relative">
          {/* Subtle Page background Glow */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-violet-600/5 blur-[120px] pointer-events-none -z-10" />
          
          {children}
        </main>
      </div>
    </div>
  );
};

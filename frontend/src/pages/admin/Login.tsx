import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useSeo } from '../../hooks/useSeo';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);

  useSeo({
    title: 'Connexion Administration | Yooreed Events',
    description: 'Portail sécurisé d\'accès à l\'administration Yooreed Events.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side rate limiting (2s between attempts)
    const now = Date.now();
    if (now - lastAttempt < 2000) return;
    setLastAttempt(now);

    setLoading(true);

    try {
      const response = await authService.login(formData.username, formData.password);
      if (response.success) {
        navigate('/admin');
      } else {
        setError('Identifiants invalides');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Identifiants invalides ou erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#05080F' }}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 blur-[160px] rounded-full" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full mx-auto px-6 relative z-10">
        
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block group">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black tracking-tighter text-white group-hover:text-violet-400 transition-colors">
                YOOREED <span className="text-violet-500">EVENTS</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">Control Panel v2.0</span>
            </div>
          </Link>
        </div>

        <div className="card p-10 border-white/5 relative bg-[#080C14]/80 backdrop-blur-xl">
          {/* Subtle glow border animate */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/20 via-transparent to-cyber-500/20 rounded-[32px] pointer-events-none" />

          <h1 className="text-xl font-bold text-white mb-2 text-center">Accès Sécurisé</h1>
          <p className="text-xs text-slate-500 text-center mb-8">Veuillez vous identifier pour accéder au tableau de bord.</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-xs flex gap-3 items-center animate-shake" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">
                Utilisateur
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  placeholder="admin_id"
                  className="input py-3.5 pl-4 focus:ring-1 focus:ring-violet-500/50"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input py-3.5 pl-4 focus:ring-1 focus:ring-violet-500/50"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 justify-center text-sm tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Authentification...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Accéder au Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <Link to="/" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Retour Site
            </Link>
            <span className="text-[10px] text-slate-700 font-medium">SSL 256-bit Encrypted</span>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] text-slate-700 font-medium">
          &copy; 2025 Yooreed Events. Tous droits réservés.<br/>
          Propulsé par la technologie Advanced Control System.
        </p>
      </div>
    </div>
  );
};

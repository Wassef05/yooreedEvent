import { useEffect, useState } from 'react';
import api from '../../services/api';
import { authService } from '../../services/authService';
import { useSeo } from '../../hooks/useSeo';

export const Profile = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'Tunisie',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  useSeo({
    title: 'Mon Profil | Administration Yooreed Events',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getMe();
      const adminData = response.data.admin;
      setAdmin(adminData);
      setFormData({
        nomComplet: adminData.nomComplet || '',
        email: adminData.email || '',
        telephone: adminData.telephone || '',
        adresse: adminData.adresse || '',
        ville: adminData.ville || '',
        codePostal: adminData.codePostal || '',
        pays: adminData.pays || 'Tunisie',
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/auth/profile', formData);
      setAdmin(response.data.data.admin);
      // Success feedback could be a toast in a real app
    } catch (error: any) {
      console.error('Erreur:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return;
    if (passwordData.newPassword.length < 6) return;

    setSaving(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Erreur:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="skeleton h-10 w-48 rounded-full" />
        <div className="card h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Mon Profil</h1>
        <p className="text-slate-500 mt-2">Gérez vos informations personnelles et vos accès de sécurité.</p>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/5 mb-8 w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'profile' 
              ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Coordonnées
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'password' 
              ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Sécurité
        </button>
      </div>

      <div className="card p-8 group relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] pointer-events-none" />

        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Identifiant</label>
                <div className="input py-3.5 px-4 bg-white/5 border-white/10 text-slate-500 cursor-not-allowed">
                  {admin?.username}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Email de gestion</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input py-3.5 px-4"
                  placeholder="admin@yooreed.tn"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.nomComplet}
                  onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                  className="input py-3.5 px-4"
                  placeholder="Administrateur Yooreed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Téléphone direct</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="input py-3.5 px-4"
                  placeholder="+216 -- --- ---"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Adresse professionnelle</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="input py-3.5 px-4"
                  placeholder="Novation City, Sousse"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Ville</label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  className="input py-3.5 px-4"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Code Postal</label>
                <input
                  type="text"
                  value={formData.codePostal}
                  onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                  className="input py-3.5 px-4"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-10 py-3 text-sm"
              >
                {saving ? 'Synchronisation...' : 'Mettre à jour le profil'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Mot de passe actuel</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="input py-3.5 px-4"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="input py-3.5 px-4"
                minLength={6}
                required
              />
              <p className="text-[10px] text-slate-600 italic mt-1 px-1">Minimum 6 caractères alphanumériques.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Confirmer le nouveau passe</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="input py-3.5 px-4"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-4 text-sm"
              >
                {saving ? 'Mise à jour sécurisée...' : 'Changer le mot de passe'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

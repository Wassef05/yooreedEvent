import { useEffect, useState } from 'react';
import { eventServiceApi } from '../../services/eventService';
import { uploadService } from '../../services/uploadService';
import { useSeo } from '../../hooks/useSeo';

type EventService = {
  _id?: string;
  titre: string;
  description: string;
  features: string[];
  images: string[];
  slug: string;
  published: boolean;
};

const emptyForm: EventService = {
  titre: '',
  description: '',
  features: [],
  images: [],
  slug: '',
  published: true,
};

export const EventServicesManagement = () => {
  const [items, setItems] = useState<EventService[]>([]);
  const [form, setForm] = useState<EventService>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useSeo({
    title: 'Gestion Prestations | Administration Yooreed Events',
  });

  const load = async () => {
    try {
      const res = await eventServiceApi.listAdmin();
      setItems(res.data.services || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await eventServiceApi.update(editingId, form);
      } else {
        await eventServiceApi.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: EventService) => {
    setForm({
      titre: item.titre,
      description: item.description,
      features: item.features,
      images: item.images,
      slug: item.slug,
      published: item.published,
    });
    setEditingId(item._id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm('Supprimer définitivement ce service ?')) return;
    await eventServiceApi.remove(id);
    await load();
  };

  const updateListField = (field: 'features' | 'images', value: string) => {
    setForm((prev) => ({ ...prev, [field]: value.split('\n').filter(Boolean) }));
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await uploadService.uploadImages(Array.from(files));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Services Événementiels</h1>
        <p className="text-slate-500 mt-2">Configurez les prestations d'équipe : régie multicam, captation, éclairage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="card p-8 sticky top-24 relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] pointer-events-none" />
            
            <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-violet-500 pl-4 uppercase tracking-widest text-xs">
              {editingId ? 'Mode Édition' : 'Ajout Prestation'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Titre du service</label>
                <input
                  className="input py-3.5 px-4"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Ex: Régie Multicam HD"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Slug (URL unique)</label>
                <input
                  className="input py-3.5 px-4 font-mono text-[11px]"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="regie-multicam-hd"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Description</label>
                <textarea
                  className="textarea p-4"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Atouts (un par ligne)</label>
                <textarea
                  className="textarea p-4 text-[11px]"
                  rows={3}
                  value={form.features.join('\n')}
                  onChange={(e) => updateListField('features', e.target.value)}
                  placeholder="Captation 4K&#10;3 Caméras fixes&#10;Streaming Live"
                />
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Médias & Galerie</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden relative group">
                       <img src={img} className="w-full h-full object-cover" />
                       <button 
                        type="button" 
                        onClick={() => setForm(p => ({...p, images: p.images.filter((_, idx)=> idx !== i)}))}
                        className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold"
                       >SUPPR</button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleUploadImages(e.target.files)}
                  className="input py-2 text-[10px]"
                />
                {uploading && <p className="text-[10px] text-violet-400">Importation en cours...</p>}
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${form.published ? 'bg-violet-600 border-violet-500' : 'border-white/20'}`}>
                  {form.published && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Visible sur le site</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 justify-center text-xs">
                  {loading ? 'Flux en cours...' : editingId ? 'Actualiser' : 'Déployer'}
                </button>
                {editingId && (
                  <button type="button" className="btn-secondary px-6" onClick={() => { setEditingId(null); setForm(emptyForm); }}>✖</button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item._id} className="card p-6 flex flex-col md:flex-row gap-8 hover:bg-white/[0.02] transition-all group">
              <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-navy-900 border border-white/5 relative">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.titre} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                ) : (
                  <div className="w-full h-full bg-violet-600/5" />
                )}
                {!item.published && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[8px] font-black uppercase text-slate-400 tracking-widest backdrop-blur-md">BROUILLON</div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors">{item.titre}</h3>
                  <code className="text-[9px] text-slate-600 mt-0.5 block">/{item.slug}</code>
                  <p className="text-slate-500 mt-4 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.features?.map((f) => (
                      <span key={f} className="tag-cyber text-[8px] uppercase tracking-tighter opacity-60">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={() => handleEdit(item)} className="text-[10px] font-black text-violet-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                     Éditer
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-[10px] font-black text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="py-20 text-center glass-panel rounded-3xl border-white/5">
               <p className="text-slate-600 italic">Aucune prestation configurée.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

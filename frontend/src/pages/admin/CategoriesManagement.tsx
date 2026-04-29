import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Category } from '../../types';
import { uploadService } from '../../services/uploadService';
import { useSeo } from '../../hooks/useSeo';

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    parentId: '',
    image: '',
  });
  const [, setUploadingImage] = useState(false);

  useSeo({
    title: 'Gestion Catégories | Administration Yooreed Events',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.flat || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        ...formData,
        parentId: formData.parentId || null,
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, categoryData);
      } else {
        await api.post('/categories', categoryData);
      }

      setShowForm(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nom: category.nom,
      description: category.description,
      parentId: category.parentId || '',
      image: category.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error: any) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', description: '', parentId: '', image: '' });
    setEditingCategory(null);
  };

  const getCategoryName = (id: string | null) => {
    if (!id) return 'Principale';
    const find = categories.find((c) => c._id === id);
    return find ? find.nom : '-';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Arborescence Catégories</h1>
          <p className="text-slate-500 mt-2">Définissez la hiérarchie du méga-menu et du catalogue public.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary px-8 py-3 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Ajouter une Catégorie
        </button>
      </div>

      {showForm && (
        <div className="card p-8 mb-12 relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] pointer-events-none" />
          
          <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-violet-500 pl-4 uppercase tracking-widest text-xs">
            {editingCategory ? 'Édition Catégorie' : 'Configuration Nouvelle Catégorie'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  className="input py-3.5 px-4"
                  placeholder="Ex: Écrans Géants LED"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Structure Parente</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="input py-3.5 px-4 dark:bg-[#0A0E17]"
                  style={{ appearance: 'none' }}
                >
                  <option value="">Aucune (Catégorie de premier niveau)</option>
                  {categories
                    .filter((c) => c._id !== editingCategory?._id)
                    .map((category) => (
                      <option key={category._id} value={category._id}>{category.nom}</option>
                    ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Description Marketing</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="textarea"
                  placeholder="Apparaît dans le méga-menu ou en haut de page catalogue..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Icône / Image Représentative</label>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex-shrink-0 relative group overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 italic text-[10px]">No Img</div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(true);
                      try {
                        const url = await uploadService.uploadImage(file);
                        setFormData({ ...formData, image: url });
                      } catch (err) { console.error(err); } finally { setUploadingImage(false); }
                    }}
                    className="input py-3 px-4 text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input py-2 px-3 text-[10px] flex-1"
                      placeholder="URL directe de l'icône"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    {formData.image && <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="text-[10px] text-red-500 font-bold uppercase hover:text-white transition-colors">Vider</button>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary px-10 py-3">Sauvegarder</button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary px-8 py-3">Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Modern Table */}
      <div className="card p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Structure</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Identifiant (Slug)</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Niveau</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12"><div className="skeleton h-10 w-full" /></td></tr>
              ) : categories.map((category) => (
                <tr key={category._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-navy-900 rounded-lg border border-white/5 flex-shrink-0 overflow-hidden">
                        {category.image ? <img src={category.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-violet-600/5" />}
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{category.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] bg-white/[0.03] px-2 py-1 rounded text-slate-400">/{category.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${!category.parentId ? 'text-cyan-400 bg-cyan-400/5' : 'text-slate-600'}`}>
                      {!category.parentId ? 'Principale' : `Sous : ${getCategoryName(category.parentId)}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button onClick={() => handleEdit(category)} className="text-[10px] font-black text-violet-500 hover:text-white transition-colors uppercase tracking-widest">Edit</button>
                      <button onClick={() => handleDelete(category._id)} className="text-[10px] font-black text-red-500/60 hover:text-red-400 transition-colors uppercase tracking-widest">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

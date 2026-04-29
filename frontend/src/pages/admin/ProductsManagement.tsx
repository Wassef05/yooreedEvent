import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import { Product } from '../../types';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import { uploadService } from '../../services/uploadService';
import { useSeo } from '../../hooks/useSeo';

export const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    sousCategorie: '',
    description: '',
    descriptionTechnique: '',
    prix: '',
    stock: '',
    delaiLivraison: 'Sur demande',
    materiaux: [] as string[],
    personnalisation: [] as string[],
    images: [] as string[],
    videos: [] as string[],
    recommandations: [] as string[],
    gravureLaser: false,
    resine: false,
  });
  const [newMaterial, setNewMaterial] = useState('');
  const [newPersonalization, setNewPersonalization] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useSeo({
    title: 'Gestion Produits | Administration Yooreed Events',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editorRef.current && formData.descriptionTechnique !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = formData.descriptionTechnique || '';
    }
  }, [formData.descriptionTechnique, showForm]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        descriptionTechnique: editorRef.current!.innerHTML,
      }));
    }
  };

  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleEditorInput();
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=100');
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.flat || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const htmlContent = editorRef.current?.innerHTML || formData.descriptionTechnique;
      const productData = {
        ...formData,
        descriptionTechnique: htmlContent,
        prix: parseFloat(formData.prix) || 0,
        stock: parseInt(formData.stock) || 0,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
      } else {
        await api.post('/products', productData);
      }

      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      alert('Erreur: ' + (error.response?.data?.error?.message || 'Erreur inconnue'));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      categorie: product.categorie,
      sousCategorie: product.sousCategorie,
      description: product.description,
      descriptionTechnique: product.descriptionTechnique,
      prix: product.prix.toString(),
      stock: product.stock.toString(),
      delaiLivraison: product.delaiLivraison,
      materiaux: product.materiaux,
      personnalisation: product.personnalisation,
      images: product.images,
      videos: product.videos,
      recommandations: product.recommandations,
      gravureLaser: product.gravureLaser || false,
      resine: product.resine || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      categorie: '',
      sousCategorie: '',
      description: '',
      descriptionTechnique: '',
      prix: '',
      stock: '',
      delaiLivraison: 'Sur demande',
      materiaux: [],
      personnalisation: [],
      images: [],
      videos: [],
      recommandations: [],
      gravureLaser: false,
      resine: false,
    });
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Catalogue Produits</h1>
          <p className="text-slate-500 mt-2">Gérez les équipements et articles du catalogue Yooreed.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary px-8 py-3 rounded-2xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Nouveau Produit
        </button>
      </div>

      {showForm && (
        <div className="card p-8 mb-12 relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-violet-500 pl-4">
            {editingProduct ? 'Modifier la Fiche' : 'Nouvelle Fiche Produit'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Nom du Produit *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  className="input py-3.5 px-4"
                />
              </div>
              <div className="space-y-2 text-white">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Catégorie *</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  required
                  className="input py-3.5 px-4 dark:bg-[#0A0E17]"
                  style={{ appearance: 'none' }}
                >
                  <option value="">-- Choisir --</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.nom}>{category.nom}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Sous-catégorie *</label>
                <input
                  type="text"
                  value={formData.sousCategorie}
                  onChange={(e) => setFormData({ ...formData, sousCategorie: e.target.value })}
                  className="input py-3.5 px-4"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Prix de base (TND)</label>
                <input type="number" step="0.01" value={formData.prix} onChange={(e) => setFormData({ ...formData, prix: e.target.value })} className="input py-3.5 px-4" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Stock disponible</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="input py-3.5 px-4" />
              </div>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-xs font-black uppercase text-violet-400 tracking-[0.25em]">Options Spéciales</h3>
              <div className="flex flex-wrap gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.gravureLaser ? 'bg-violet-600 border-violet-500' : 'border-white/20'}`}>
                    {formData.gravureLaser && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.gravureLaser} onChange={(e) => setFormData({ ...formData, gravureLaser: e.target.checked })} />
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Gravure Laser</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.resine ? 'bg-cyan-600 border-cyan-500' : 'border-white/20'}`}>
                    {formData.resine && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.resine} onChange={(e) => setFormData({ ...formData, resine: e.target.checked })} />
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Résine</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Description Marketing *</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} className="textarea" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Fiche Technique (HTML/Rich-Text)</label>
              <div className="border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="flex flex-wrap gap-1 p-3 bg-white/[0.03] border-b border-white/5">
                  {['Bold', 'Italic', 'Underline', 'InsertUnorderedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'].map(cmd => (
                    <button key={cmd} type="button" onClick={() => applyFormat(cmd.charAt(0).toLowerCase() + cmd.slice(1))} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-all uppercase">{cmd.charAt(0)}</button>
                  ))}
                </div>
                <div ref={editorRef} contentEditable onInput={handleEditorInput} className="w-full min-h-[120px] p-6 focus:outline-none bg-white/[0.01] text-sm leading-relaxed" />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button type="submit" className="btn-primary px-10 py-4">Confirmer</button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary px-8 py-4">Fermer</button>
            </div>
          </form>
        </div>
      )}

      {/* Modern Table Container */}
      <div className="card p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Visuel</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Produit</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Catégorie</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Prix</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Stock</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i}><td colSpan={6} className="px-6 py-8"><div className="skeleton h-10 w-full" /></td></tr>
                ))
              ) : products.map((product) => (
                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-14 h-14 bg-navy-900 rounded-xl border border-white/10 overflow-hidden">
                      {product.images[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-700 italic">No Img</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{product.nom}</p>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-1">{product.sousCategorie}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge-cyber text-[10px]">{product.categorie}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-white text-sm">{product.prix} <span className="text-[10px] text-slate-600">TND</span></td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${product.stock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {product.stock} pcs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button onClick={() => handleEdit(product)} className="text-xs font-bold text-violet-400 hover:text-white transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-xs font-bold text-red-400 hover:text-white transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
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

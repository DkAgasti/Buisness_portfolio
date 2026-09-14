'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Save, Loader2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export default function ProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'Full Stack', tech: [], github: '#', live: '#', coverImage: '', gallery: [] });
  const [techInput, setTechInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const galleryFileRef = useRef(null);
  const coverFileRef = useRef(null);

  const fetchItems = () => {
    fetch(`${API}/api/admin/projects`, { headers: authHeaders() })
      .then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => { setForm({ name: '', description: '', category: 'Full Stack', tech: [], github: '#', live: '#', coverImage: '', gallery: [] }); setEditing(null); setTechInput(''); setImageInput(''); };

  const saveProject = async () => {
    if (!form.name) { toast.error('Name required'); return; }
    const url = editing ? `${API}/api/admin/projects/${editing}` : `${API}/api/admin/projects`;
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
    if (res.ok) { toast.success(editing ? 'Updated' : 'Added'); resetForm(); fetchItems(); }
  };

  const editProject = (item) => {
    setEditing(item._id || item.id);
    setForm({ name: item.name, description: item.description, category: item.category, tech: item.tech || [], github: item.github, live: item.live, coverImage: item.coverImage || '', gallery: item.gallery || [] });
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`${API}/api/admin/projects/${id}`, { method: 'DELETE', headers: authHeaders() });
    toast.success('Deleted'); fetchItems();
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setForm({...form, tech: [...form.tech, techInput.trim()]});
    setTechInput('');
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setForm({...form, gallery: [...form.gallery, url]});
    setImageInput('');
  };

  // Upload one or more local files to the backend, then store the returned URLs.
  const uploadFiles = async (fileList, target) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) {
        const fd = new FormData();
        fd.append('file', f);
        const res = await fetch(`${API}/api/admin/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${getToken()}` }, // no Content-Type — browser sets multipart boundary
          body: fd,
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.url) urls.push(data.url);
        else toast.error(data.detail || `Failed to upload ${f.name}`);
      }
      if (!urls.length) return;
      if (target === 'cover') setForm((prev) => ({ ...prev, coverImage: urls[0] }));
      else setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
      toast.success(`Uploaded ${urls.length} image${urls.length > 1 ? 's' : ''}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Projects</h1>
      {/* Form */}
      <div className="glass rounded-xl p-5 mb-6">
        <h3 className="font-heading font-semibold mb-3">{editing ? 'Edit Project' : 'Add Project'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Project name"
            className="px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
            className="px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="Full Stack">Full Stack</option><option value="Backend">Backend</option><option value="API">API</option><option value="Frontend">Frontend</option>
          </select>
        </div>
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={2}
          className="w-full px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-3" />
        <div className="flex gap-3 mb-3">
          <input value={form.github} onChange={e => setForm({...form, github: e.target.value})} placeholder="GitHub URL"
            className="flex-1 px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <input value={form.live} onChange={e => setForm({...form, live: e.target.value})} placeholder="Live URL"
            className="flex-1 px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        {/* Cover image — paste a URL OR upload a local file (first slide in the popup) */}
        <div className="mb-3">
          <label className="block text-xs text-muted-foreground mb-1.5">Cover image (optional) — paste URL or upload</label>
          <div className="flex gap-2">
            <input value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} placeholder="Cover image URL"
              className="flex-1 px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button type="button" disabled={uploading} onClick={() => coverFileRef.current?.click()}
              className="px-3 py-2.5 bg-muted/60 border border-border rounded-lg text-sm flex items-center gap-1 disabled:opacity-50">
              <Upload className="w-4 h-4" /> Upload
            </button>
            <input ref={coverFileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { uploadFiles(e.target.files, 'cover'); e.target.value = ''; }} />
          </div>
          {form.coverImage && (
            <div className="relative group w-20 h-20 mt-2 rounded-lg overflow-hidden border border-border bg-muted/60">
              <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setForm({...form, coverImage: ''})}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove cover"><X className="w-3 h-3" /></button>
            </div>
          )}
        </div>

        {/* Gallery images — added here become the auto-sliding carousel in the popup */}
        <div className="mb-3">
          <label className="block text-xs text-muted-foreground mb-1.5">Gallery images (multiple — these slide in the popup)</label>
          <div className="flex gap-2 mb-2">
            <input value={imageInput} onChange={e => setImageInput(e.target.value)} onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addImage())} placeholder="Paste image URL and press Enter"
              className="flex-1 px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button type="button" onClick={addImage} className="px-3 py-2.5 bg-muted/60 border border-border rounded-lg text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
            <button type="button" disabled={uploading} onClick={() => galleryFileRef.current?.click()}
              className="px-3 py-2.5 bg-muted/60 border border-border rounded-lg text-sm flex items-center gap-1 disabled:opacity-50">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
            </button>
            <input ref={galleryFileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => { uploadFiles(e.target.files, 'gallery'); e.target.value = ''; }} />
          </div>
          {form.gallery.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.gallery.map((url, i) => (
                <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted/60">
                  <img src={url} alt={`gallery ${i+1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm({...form, gallery: form.gallery.filter((_,idx)=>idx!==i)})}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {form.tech.map((t,i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-muted/60 border border-border">
              {t} <button onClick={() => setForm({...form, tech: form.tech.filter((_,idx)=>idx!==i)})}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <div className="flex gap-1">
            <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key==='Enter' && addTech()} placeholder="Add tech"
              className="w-24 px-2 py-1 text-xs rounded bg-muted/60 border border-border focus:outline-none" />
            <button onClick={addTech} className="px-2 py-1 text-xs bg-muted/60 border border-border rounded"><Plus className="w-3 h-3" /></button>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={saveProject} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> {editing ? 'Update' : 'Add'}
          </button>
          {editing && <button onClick={resetForm} className="px-4 py-2 bg-muted/60 border border-border rounded-xl text-sm">Cancel</button>}
        </div>
      </div>
      {/* List */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id||item.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{item.name}</span>
                <span className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary">{item.category}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
            </div>
            <div className="flex gap-2 ml-3">
              <button onClick={() => editProject(item)} className="px-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg hover:bg-muted">Edit</button>
              <button onClick={() => deleteProject(item._id||item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

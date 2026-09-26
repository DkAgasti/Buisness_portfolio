'use client';

import { useEffect, useRef, useState } from 'react';
import { Save, Loader2, Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function SiteConfigPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const avatarFileRef = useRef(null);
  const logoFileRef = useRef(null);

  const uploadImage = async (file, field) => {
    if (!file) return;
    setUploadingField(field);
    try {
      const token = localStorage.getItem('admin_token');
      const fd = new FormData();
      fd.append('file', file);
      // No Content-Type header — the browser sets the multipart boundary.
      const res = await fetch(`${API}/api/admin/upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');
      setConfig((c) => ({ ...c, [field]: data.url }));
      toast.success('Image uploaded — click Save Changes to apply');
    } catch (e) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploadingField(null);
      if (avatarFileRef.current) avatarFileRef.current.value = '';
      if (logoFileRef.current) logoFileRef.current.value = '';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch(`${API}/api/admin/site-config`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setConfig).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API}/api/admin/site-config`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Site config saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', section: 'Profile' },
    { key: 'role', label: 'Role / Title', type: 'text', section: 'Profile' },
    { key: 'bio', label: 'Bio (About Me)', type: 'textarea', section: 'Profile' },
    { key: 'location', label: 'Location', type: 'text', section: 'Profile' },

    { key: 'email', label: 'Email', type: 'email', section: 'Contact & Socials' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text', section: 'Contact & Socials' },
    { key: 'responseTime', label: 'Response Time', type: 'text', section: 'Contact & Socials' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'url', section: 'Contact & Socials' },
    { key: 'twitter', label: 'Twitter / X URL', type: 'url', section: 'Contact & Socials' },
    { key: 'instagram', label: 'Instagram URL', type: 'url', section: 'Contact & Socials' },

    { key: 'stats_projects', label: 'Stats: Projects Count', type: 'number', section: 'Stats' },
    { key: 'stats_clients', label: 'Stats: Clients Count', type: 'number', section: 'Stats' },
    { key: 'stats_experience', label: 'Stats: Years Experience', type: 'number', section: 'Stats' },
    { key: 'stats_satisfaction', label: 'Stats: Client Satisfaction %', type: 'number', section: 'Stats' },

    {
      key: 'ai_knowledge_base',
      label: 'AI Chatbot Knowledge Base',
      type: 'textarea',
      rows: 18,
      section: 'AI Chatbot',
      hint: 'This is what the AI chat widget reads to answer visitor questions. Edit it here and click Save — no redeploy needed.',
    },
  ];

  let lastSection = null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Site Configuration</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
        </button>
      </div>
      <div className="glass rounded-xl p-6 space-y-4">
        {/* Site logo — shown in the Navbar, Footer and Loading Screen */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Site Logo (Navbar, Footer, Loading Screen)</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border bg-muted/60 flex items-center justify-center flex-shrink-0">
              {config?.logo ? (
                <img src={config.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="w-7 h-7 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={logoFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e.target.files?.[0], 'logo')}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={uploadingField === 'logo'}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-muted/60 border border-border rounded-lg text-sm hover:bg-muted disabled:opacity-50"
                >
                  {uploadingField === 'logo' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {config?.logo ? 'Change image' : 'Upload image'}
                </button>
                {config?.logo && (
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, logo: '' })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-sm hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF — up to 8 MB. Then click Save Changes.</p>
            </div>
          </div>
        </div>

        {/* Profile image — shown in the About Me section only */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Profile Image (About Me)</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border bg-muted/60 flex items-center justify-center flex-shrink-0">
              {config?.avatar ? (
                <img src={config.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-7 h-7 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e.target.files?.[0], 'avatar')}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  disabled={uploadingField === 'avatar'}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-muted/60 border border-border rounded-lg text-sm hover:bg-muted disabled:opacity-50"
                >
                  {uploadingField === 'avatar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {config?.avatar ? 'Change image' : 'Upload image'}
                </button>
                {config?.avatar && (
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, avatar: '' })}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-sm hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF — up to 8 MB. Then click Save Changes.</p>
            </div>
          </div>
        </div>

        {fields.map(f => {
          const showHeading = f.section !== lastSection;
          lastSection = f.section;
          return (
            <div key={f.key}>
              {showHeading && (
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70 pt-2 pb-1 first:pt-0">{f.section}</h4>
              )}
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">{f.label}</label>
              {f.hint && <p className="text-xs text-muted-foreground/70 mb-1.5">{f.hint}</p>}
              {f.type === 'textarea' ? (
                <textarea value={config?.[f.key] || ''} onChange={e => setConfig({...config, [f.key]: e.target.value})} rows={f.rows || 4}
                  className={`w-full px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none ${f.rows ? 'font-mono' : ''}`} />
              ) : (
                <input type={f.type} value={config?.[f.key] || ''}
                  onChange={e => setConfig({...config, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value})}
                  className="w-full px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

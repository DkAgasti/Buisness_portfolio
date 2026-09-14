'use client';

import { useEffect, useState } from 'react';
import { Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });
const EMPTY = { text: '' };

export default function RolesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const fetchItems = () => {
    fetch(`${API}/api/admin/roles`, { headers: authHeaders() })
      .then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const save = async () => {
    if (!form.text) { toast.error('Text required'); return; }
    const url = editing ? `${API}/api/admin/roles/${editing}` : `${API}/api/admin/roles`;
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
    if (res.ok) { toast.success(editing ? 'Updated' : 'Added'); setForm(EMPTY); setEditing(null); fetchItems(); }
  };

  const edit = (item) => { setEditing(item._id||item.id); setForm({ text: item.text }); };
  const remove = async (id) => { if (!confirm('Delete?')) return; await fetch(`${API}/api/admin/roles/${id}`, { method: 'DELETE', headers: authHeaders() }); toast.success('Deleted'); fetchItems(); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Hero Roles</h1>
      <p className="text-sm text-muted-foreground mb-4">The rotating titles typed under your name in the hero section.</p>
      <div className="glass rounded-xl p-5 mb-6">
        <h3 className="font-heading font-semibold mb-3">{editing ? 'Edit Role' : 'Add Role'}</h3>
        <div className="space-y-3">
          <input value={form.text} onChange={e => setForm({...form, text: e.target.value})} placeholder="e.g. Full Stack Developer"
            className="w-full px-3 py-2.5 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium flex items-center gap-2"><Save className="w-4 h-4" /> {editing?'Update':'Add'}</button>
            {editing && <button onClick={() => { setEditing(null); setForm(EMPTY); }} className="px-4 py-2 bg-muted/60 border border-border rounded-xl text-sm">Cancel</button>}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id||item.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="font-medium">{item.text}</span>
            <div className="flex gap-2 ml-3">
              <button onClick={() => edit(item)} className="px-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg hover:bg-muted">Edit</button>
              <button onClick={() => remove(item._id||item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

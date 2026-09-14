'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export default function ExperiencePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    fetch(`${API}/api/admin/experience`, { headers: authHeaders() })
      .then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const addItem = async () => {
    const res = await fetch(`${API}/api/admin/experience`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ company: 'New Company', role: 'Role Title', duration: '2024 - Present', achievements: ['Achievement 1'] }),
    });
    if (res.ok) { toast.success('Added'); fetchItems(); }
  };

  const updateItem = async (id, data) => {
    await fetch(`${API}/api/admin/experience/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
    toast.success('Saved');
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await fetch(`${API}/api/admin/experience/${id}`, { method: 'DELETE', headers: authHeaders() });
    toast.success('Deleted'); fetchItems();
  };

  const updateField = (id, field, value) => {
    setItems(items.map(i => (i._id||i.id) === id ? {...i, [field]: value} : i));
  };

  const addAchievement = (item) => {
    const text = prompt('Enter achievement');
    if (!text) return;
    const updated = {...item, achievements: [...item.achievements, text]};
    setItems(items.map(i => (i._id||i.id) === (item._id||item.id) ? updated : i));
    updateItem(item._id||item.id, updated);
  };

  const removeAchievement = (item, idx) => {
    const updated = {...item, achievements: item.achievements.filter((_,i) => i !== idx)};
    setItems(items.map(i => (i._id||i.id) === (item._id||item.id) ? updated : i));
    updateItem(item._id||item.id, updated);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Experience</h1>
        <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>
      <div className="space-y-4">
        {items.map(item => {
          const id = item._id || item.id;
          return (
            <div key={id} className="glass rounded-xl p-5">
              <div className="flex justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <input value={item.company} onChange={e => updateField(id,'company',e.target.value)}
                    onBlur={() => updateItem(id, item)} placeholder="Company"
                    className="w-full text-lg font-semibold bg-transparent border-b border-transparent focus:border-primary/40 focus:outline-none" />
                  <div className="flex gap-3">
                    <input value={item.role} onChange={e => updateField(id,'role',e.target.value)}
                      onBlur={() => updateItem(id, item)} placeholder="Role"
                      className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-primary/40 focus:outline-none text-muted-foreground" />
                    <input value={item.duration} onChange={e => updateField(id,'duration',e.target.value)}
                      onBlur={() => updateItem(id, item)} placeholder="Duration"
                      className="w-40 text-sm bg-transparent border-b border-transparent focus:border-primary/40 focus:outline-none text-muted-foreground" />
                  </div>
                </div>
                <button onClick={() => deleteItem(id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600 ml-3"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-1 mb-2">
                {item.achievements?.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">\u25B8</span>
                    <span className="flex-1">{a}</span>
                    <button onClick={() => removeAchievement(item, idx)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => addAchievement(item)} className="text-xs text-primary hover:underline">+ Add Achievement</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

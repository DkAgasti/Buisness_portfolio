'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');

  const fetchSkills = () => {
    fetch(`${API}/api/admin/skills`, { headers: authHeaders() })
      .then(r => r.json()).then(setSkills).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSkills(); }, []);

  const addCategory = async () => {
    const name = prompt('Enter category name (e.g. "Cloud")');
    if (!name) return;
    const res = await fetch(`${API}/api/admin/skills`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ category: name, icon: 'Server', color: 'from-blue-500/20 to-blue-600/10', items: [] }),
    });
    if (res.ok) { toast.success('Category added'); fetchSkills(); }
  };

  const updateSkill = async (id, data) => {
    await fetch(`${API}/api/admin/skills/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
    toast.success('Saved');
  };

  const deleteSkill = async (id) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`${API}/api/admin/skills/${id}`, { method: 'DELETE', headers: authHeaders() });
    toast.success('Deleted');
    fetchSkills();
  };

  const addItem = (skill) => {
    if (!newItem.trim()) return;
    const updated = { ...skill, items: [...skill.items, newItem.trim()] };
    updateSkill(skill._id || skill.id, updated);
    setSkills(skills.map(s => (s._id || s.id) === (skill._id || skill.id) ? updated : s));
    setNewItem('');
  };

  const removeItem = (skill, idx) => {
    const updated = { ...skill, items: skill.items.filter((_, i) => i !== idx) };
    updateSkill(skill._id || skill.id, updated);
    setSkills(skills.map(s => (s._id || s.id) === (skill._id || skill.id) ? updated : s));
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Skills / Tech Arsenal</h1>
        <button onClick={addCategory} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      <div className="space-y-4">
        {skills.map(skill => (
          <div key={skill._id || skill.id} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <input value={skill.category} onChange={e => {
                const updated = {...skill, category: e.target.value};
                setSkills(skills.map(s => (s._id||s.id)===(skill._id||skill.id) ? updated : s));
              }} onBlur={() => updateSkill(skill._id||skill.id, skill)}
                className="text-lg font-semibold font-heading bg-transparent border-b border-transparent focus:border-primary/40 focus:outline-none" />
              <button onClick={() => deleteSkill(skill._id||skill.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {skill.items.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-muted/60 border border-border">
                  {item}
                  <button onClick={() => removeItem(skill, idx)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Add technology..."
                onKeyDown={e => e.key === 'Enter' && addItem(skill)}
                className="flex-1 px-3 py-2 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button onClick={() => addItem(skill)} className="px-3 py-2 bg-muted/60 hover:bg-muted border border-border rounded-lg text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

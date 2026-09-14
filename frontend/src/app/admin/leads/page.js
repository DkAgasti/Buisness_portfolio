'use client';

import { useEffect, useState } from 'react';
import { Trash2, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export default function LeadsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    fetch(`${API}/api/admin/leads`, { headers: authHeaders() })
      .then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const deleteItem = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`${API}/api/admin/leads/${id}`, { method: 'DELETE', headers: authHeaders() });
    toast.success('Deleted'); fetchItems();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Leads</h1>
        <span className="text-sm text-muted-foreground">{items.length} total</span>
      </div>
      {items.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-muted-foreground">No leads collected yet</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id || item.id} className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium">{item.email}</span>
                  <p className="text-xs text-muted-foreground">
                    {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>
              <button onClick={() => deleteItem(item._id || item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

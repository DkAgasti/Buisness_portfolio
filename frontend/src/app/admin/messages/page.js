'use client';

import { useEffect, useState } from 'react';
import { Trash2, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export default function MessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    fetch(`${API}/api/admin/messages`, { headers: authHeaders() })
      .then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const deleteItem = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`${API}/api/admin/messages/${id}`, { method: 'DELETE', headers: authHeaders() });
    toast.success('Deleted'); fetchItems();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Contact Messages</h1>
        <span className="text-sm text-muted-foreground">{items.length} total</span>
      </div>
      {items.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-muted-foreground">No messages yet</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id||item.id} className="glass rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Mail className="w-4 h-4 text-primary" /></div>
                    <div>
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{item.email}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  <div className="ml-11">
                    <span className="px-2 py-0.5 text-xs rounded bg-muted/60 border border-border mr-2">{item.project_type}</span>
                    <p className="text-sm text-muted-foreground mt-2">{item.message}</p>
                  </div>
                </div>
                <button onClick={() => deleteItem(item._id||item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600 ml-3"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

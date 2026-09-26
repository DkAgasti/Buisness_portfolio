'use client';

import { useEffect, useState } from 'react';
import { Trash2, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const getToken = () => localStorage.getItem('admin_token');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    fetch(`${API}/api/admin/testimonials`, { headers: authHeaders() })
      .then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const deleteItem = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`${API}/api/admin/testimonials/${id}`, { method: 'DELETE', headers: authHeaders() });
    toast.success('Deleted'); fetchItems();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Testimonials</h1>
        <span className="text-sm text-muted-foreground">{items.length} total</span>
      </div>
      {items.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-muted-foreground">No testimonials yet</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id||item.id} className="glass rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s<=item.rating?'fill-yellow-400 text-yellow-400':'text-muted-foreground/40'}`} />)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground break-words">&ldquo;{item.message}&rdquo;</p>
                </div>
                <button onClick={() => deleteItem(item._id||item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-600 ml-3 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

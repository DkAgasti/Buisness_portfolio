'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, User, Code2, Briefcase, FolderOpen, Wrench, MessageSquare, Mail, LogOut, ChevronLeft, Menu, Sparkles, Workflow, HelpCircle, Type } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Site Config', href: '/admin/site-config', icon: User },
  { name: 'Skills', href: '/admin/skills', icon: Code2 },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Services', href: '/admin/services', icon: Wrench },
  { name: 'Why Work With Me', href: '/admin/why', icon: Sparkles },
  { name: 'Process', href: '/admin/process', icon: Workflow },
  { name: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Hero Roles', href: '/admin/roles', icon: Type },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Messages', href: '/admin/messages', icon: Mail },
  { name: 'Leads', href: '/admin/leads', icon: User },
];

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login' || pathname === '/admin/forgot-password') { setChecking(false); setAuthed(true); return; }
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => { setAuthed(true); setChecking(false); })
      .catch(() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); });
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  if (checking) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password') return <>{children}</>;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d1a] border-r border-white/10 transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="font-heading font-semibold text-sm">Admin Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/5 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarLinks.map(({ name, href, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}>
              <Icon className="w-4 h-4" /> {name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-heading font-semibold text-sm capitalize">
            {sidebarLinks.find(l => l.href === pathname)?.name || 'Admin'}
          </h2>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}

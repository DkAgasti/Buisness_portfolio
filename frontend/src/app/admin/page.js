'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, MessageSquare, Mail, Star, Users } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, testimonials: 0, messages: 0, leads: 0 });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/admin/projects`, { headers }).then(r => r.json()),
      fetch(`${API}/api/admin/testimonials`, { headers }).then(r => r.json()),
      fetch(`${API}/api/admin/messages`, { headers }).then(r => r.json()),
      fetch(`${API}/api/admin/leads`, { headers }).then(r => r.json()),
    ]).then(([projects, testimonials, messages, leads]) => {
      setStats({ projects: projects.length, testimonials: testimonials.length, messages: messages.length, leads: leads.length });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Projects', count: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-500' },
    { label: 'Testimonials', count: stats.testimonials, icon: Star, href: '/admin/testimonials', color: 'text-yellow-500' },
    { label: 'Messages', count: stats.messages, icon: Mail, href: '/admin/messages', color: 'text-green-500' },
    { label: 'Leads', count: stats.leads, icon: Users, href: '/admin/leads', color: 'text-cyan-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Welcome Back</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} href={c.href} className="glass rounded-xl p-5 hover:bg-muted/70 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <c.icon className={`w-5 h-5 ${c.color}`} />
              <span className="text-sm text-muted-foreground">{c.label}</span>
            </div>
            <p className="text-3xl font-bold font-heading">{c.count}</p>
          </Link>
        ))}
      </div>
      <div className="glass rounded-xl p-5">
        <h3 className="font-heading font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{l:'Edit Profile',h:'/admin/site-config'},{l:'Manage Skills',h:'/admin/skills'},{l:'Edit Projects',h:'/admin/projects'},{l:'View Messages',h:'/admin/messages'}].map(a=>(
            <Link key={a.h} href={a.h} className="px-4 py-3 rounded-lg bg-muted/60 border border-border text-sm text-center hover:bg-muted transition-colors">{a.l}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}

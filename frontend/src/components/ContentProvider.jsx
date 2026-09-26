'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const ContentContext = createContext({});

export function ContentProvider({ children }) {
  const [content, setContent] = useState({
    siteConfig: null,
    skills: null,
    projects: null,
    services: null,
    process: null,
    loaded: false,
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/content/site-config`).then(r => r.json()),
      fetch(`${API}/api/content/skills`).then(r => r.json()),
      fetch(`${API}/api/content/projects`).then(r => r.json()),
      fetch(`${API}/api/content/services`).then(r => r.json()),
      fetch(`${API}/api/content/process`).then(r => r.json()),
    ]).then(([siteConfig, skills, projects, services, process]) => {
      setContent({ siteConfig, skills, projects, services, process, loaded: true });
    }).catch(() => {
      // Fallback to defaults if API fails
      setContent(prev => ({ ...prev, loaded: true }));
    });
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

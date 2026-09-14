'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ContentProvider } from '@/components/ContentProvider';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <ContentProvider>
        {children}
      </ContentProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </ThemeProvider>
  );
}

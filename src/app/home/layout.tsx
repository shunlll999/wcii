'use client';
import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@theme/theme';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div>
      <header>Main Layout Header</header>
      <ThemeProvider theme={createAppTheme(mode)}>
        <CssBaseline /> {/* reset style ของ browser */}
        <main>{children}</main>
        <footer>Main Layout Footer</footer>
      </ThemeProvider>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import styles from './view.module.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme } from '@theme/theme';

interface IViewLayoutProps {
  children: React.ReactNode;
}

export default function ViewLayout({ children }: IViewLayoutProps) {
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
    <ThemeProvider theme={createAppTheme(mode)}>
      <CssBaseline />
      <div className={styles['view-body']}>
        {children}
      </div>
    </ThemeProvider>
  );
}

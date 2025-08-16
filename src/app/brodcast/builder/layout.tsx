'use client';
import { Navigation } from '@Components/builder/nav/navigation';
import styles from './layout.module.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@theme/theme';
import { useEffect, useState } from 'react';
import { ImageCard } from '@Shared/controllers/propsClasses/presets/ImageCard.preset';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const imageCardInstance = new ImageCard();

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
      <div className={styles.layout}>
        <header className={styles.header}>Builder Header</header>
        <main className={styles.main}>
           <nav>Navigation</nav>
          <section className={styles.section}>{children}</section>
          <nav className={styles.inspector}>Inspector</nav>
        </main>
      </div>
    </ThemeProvider>
  );
}

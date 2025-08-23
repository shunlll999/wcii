'use client';
import styles from './layout.module.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@theme/theme';
import { useEffect, useState } from 'react';
import { Inspector } from '@Shared/components/ui/inspector';
import { ImageCard } from '@Shared/controllers/propsClasses/presets/ImageCard.preset';
import { Navigation } from '@Components/builder/nav';
import axios from 'axios';
import { ROUTE_API } from '@Shared/constants';
import { PresetResponseType } from '@Shared/types';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const imageCardInstance = new ImageCard();
  const [preset, setPresetDAta] = useState<PresetResponseType>({
    data: [],
    type: '',
  });

  const presets = async () => {
    const { data } = await axios.get(ROUTE_API.NAVIGATION, {
      params: {
        type: 'presets',
      },
    });
    setPresetDAta(data);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    // CALL API TO GET presets();
    presets();
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return (
    <ThemeProvider theme={createAppTheme(mode)}>
      <CssBaseline />
      <div className={styles.layout}>
        <header className={styles.header}>Builder Header</header>
        <main className={styles.main}>
          <nav className={styles.nav}>
            <Navigation presets={preset} />
          </nav>
          <section className={styles.section}>{children}</section>
          <nav>
            <Inspector instance={imageCardInstance} />
          </nav>
        </main>
      </div>
    </ThemeProvider>
  );
}

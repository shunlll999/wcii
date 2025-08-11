'use client';
import { useEffect, useState } from 'react';
import styles from './view.module.css';
import { CssBaseline, TextField, ThemeProvider } from '@mui/material';
import { createAppTheme } from '@theme/theme';
import { EVENTS } from '@Shared/constants/event';
import { onEventListener } from '@Shared/type';

export default function View() {
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
  const [presets, setPresets] = useState<any[]>([]);
  const handlePresetDispatch = (event: MessageEvent<onEventListener>) => {
    const { event: eventType, payload } = event.data;
    if (eventType === 'add-preset') {
      setPresets(prevPresets => [...prevPresets, payload.preset]);
    }
  };

  const onHandlePreset = (preset: string) => {
    if (window.parent) {
      window.postMessage({ event: EVENTS.ON_INSPECTOR_OPEN, payload: { isOpen: true, preset } }, '*');
    }
  };

  useEffect(() => {
    window.addEventListener('message', handlePresetDispatch);
    return () => {
      window.removeEventListener('message', handlePresetDispatch);
    };
  }, []);

  const mapPresets = {
    text: <TextField id="outlined-basic" label="Outlined" variant="outlined" fullWidth />,
    image: (
      <img
        width={300}
        height={300}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        alt="Travis Howard"
        src="https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXhhbXBsZXxlbnwwfHwwfHx8MA%3D%3D"
      />
    ),
  } as const;

  return (
    <ThemeProvider theme={createAppTheme(mode)}>
      <CssBaseline /> {/* reset style ของ browser */}
      <div className={styles['view-body']}>
        {presets.map((preset, index) => (
          <div className={styles['view-preset']} onClick={() => onHandlePreset(preset)} key={index}>
            {typeof preset === 'string' && mapPresets[preset as keyof typeof mapPresets] ? (
              mapPresets[preset as keyof typeof mapPresets]
            ) : (
              <div>Unknown preset type: {preset}</div>
            )}
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}

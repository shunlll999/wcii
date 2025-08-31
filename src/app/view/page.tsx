'use client';
import { useEffect, useState } from 'react';
import styles from './view.module.css';
import { CssBaseline, TextField, ThemeProvider } from '@mui/material';
import { createAppTheme } from '@theme/theme';
import { EVENTS } from '@Shared/constants/event';
import { useAppDispatch } from '@Shared/hooks/useAppDispatch';
import { DispatchEventType, PresetAction } from '@Shared/types/dispatch.type';

export default function View() {
  const { appController } = useAppDispatch();
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
  const [presets, setPresets] = useState<string[]>([]);
  const handlePresetDispatch = (data: DispatchEventType) => {
    const { event: eventType, payload } = data;
    if (eventType === EVENTS.ON_BUILDER_DISPATCH) {
      setPresets(prevPresets => [...prevPresets, payload.preset]);
    }
  };

  const onHandlePreset = (preset: string) => {
    if (window.parent) {
      const messageData: DispatchEventType = {
        event: EVENTS.ON_INSPECTOR_OPEN,
        type: PresetAction.UPDATE,
        payload: {
          preset,
          action: PresetAction.UPDATE,
          command: {
            control: 'inspector',
            type: PresetAction.OPEN_INSPECTOR,
            value: { isOpen: true },
          }
        },
      };
      appController.sendMessage(window, messageData);
    }
  };

  useEffect(() => {
    appController.receiveMessage(window, handlePresetDispatch);
    return () => {
      appController.removeListener('message', handlePresetDispatch);
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
      <CssBaseline />
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

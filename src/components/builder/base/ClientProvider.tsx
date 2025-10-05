'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { CHANNEL_NAME } from '@Shared/constants';
import { createSecureChannel } from '@Shared/modules/channel';
import { createAppTheme } from '@theme/theme';
import { useEffect, useMemo, useState } from 'react';
import { BuilderContext, ChannelInstance } from '../contexts/builderContext';

type ClientProviderProps = {
  children: React.ReactNode;
};
export const ClientProviders = ({ children }: ClientProviderProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setMode(mq.matches ? 'dark' : 'light');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const navigationChannel = useMemo(() => createSecureChannel(CHANNEL_NAME.NAVIGATION) as ChannelInstance, []);
  const presetChannel = useMemo(() => createSecureChannel(CHANNEL_NAME.PRESET) as ChannelInstance, []);
  const componentChannel = useMemo(() => createSecureChannel(CHANNEL_NAME.COMPONENT) as ChannelInstance, []);
  const pageChannel = useMemo(() => createSecureChannel(CHANNEL_NAME.PAGE) as ChannelInstance, []);
  const inspectorChannel = useMemo(() => createSecureChannel(CHANNEL_NAME.INSPECTOR) as ChannelInstance, []);
  const storeChannel = useMemo(() => createSecureChannel(CHANNEL_NAME.STORE) as ChannelInstance, []);

  useEffect(() => {
    return () => {
      navigationChannel.close();
      presetChannel.close();
      componentChannel.close();
      pageChannel.close();
      inspectorChannel.close();
      storeChannel.close();
    };
  }, [])

  return (
    <BuilderContext.Provider
      value={{
        channels: {
          NAVIGATION: navigationChannel,
          PRESET: presetChannel,
          COMPONENT: componentChannel,
          PAGE: pageChannel,
          INSPECTOR: inspectorChannel,
          STORE: storeChannel,
        },
      }}
    >
      <ThemeProvider theme={createAppTheme(mode)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </BuilderContext.Provider>
  );
};

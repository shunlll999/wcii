'use client';

import { CssBaseline, ThemeProvider } from "@mui/material"
import { createAppTheme } from "@theme/theme";
import { useEffect, useState } from "react";

type ClientProviderProps = {
  children: React.ReactNode
}
export const ClientProviders = ({ children }: ClientProviderProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setMode(mq.matches ? 'dark' : 'light');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <ThemeProvider theme={createAppTheme(mode)}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

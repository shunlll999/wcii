/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import styles from './layout.module.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@theme/theme';
import { useEffect, useRef, useState } from 'react';
import { createSecureChannel } from '@Shared/modules/channel/secureChannel';
import { EVENTS } from '@Shared/constants/event';

type SecureChan = {
  close: () => void;
  // ถ้ามี method อื่น ๆ ใส่เพิ่มได้ เช่น post: (data:any) => void
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [openInspector, setInspector] = useState<boolean>(false);

  const channelRef = useRef<Record<string, SecureChan | undefined>>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // ✅ จับ snapshot ของ ref ไว้
    const channels = channelRef.current;

    // สร้าง channel ครั้งเดียวตอน mount
    const ch = createSecureChannel('secure_channel_1', (message: any) => {
      if (message?.payload?.event === EVENTS.ON_INSPECTOR_OPEN) {
        setInspector(Boolean(message?.payload?.payload?.command?.value?.isOpen));
      }
    });

    channels['channel1'] = ch;

    return () => {
      // ✅ ใช้ snapshot เดิม ไม่อ้าง channelRef.current ตอน cleanup
      channels['channel1']?.close();
      delete channels['channel1'];
    };
  }, []); // ✅ ไม่ใส่ channelRef.current ใน deps

  return (
    <ThemeProvider theme={createAppTheme(mode)}>
      <CssBaseline />
      <div className={styles.layout}>
        <header className={styles.header}>Builder Header</header>
        <main className={styles.main}>
          <nav>Navigation</nav>
          <section className={styles.section}>{children}</section>
          <nav className={`${styles.inspector} ${openInspector && styles.open}`}>Inspector</nav>
        </main>
      </div>
    </ThemeProvider>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './layout.module.css';
import { createSecureChannel } from '@Shared/modules/channel/secureChannel';

export default function Builder() {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [messages, setMessage] = useState<string[]>([]);
  const channelRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    channelRef.current['channel1'] = createSecureChannel('secure_channel_1', (message: any) => {
      setMessage((prev) => [...prev, `[channel1] From ${message.from}: ${JSON.stringify(message.payload)}`]);
    });

    channelRef.current['channel2'] = createSecureChannel('secure_channel_2', (message: any) => {
      setMessage((prev) => [...prev, `[channel2] From ${message.from}: ${JSON.stringify(message.payload)}`]);
    });

    return () => {
      channelRef.current['channel1']?.close();
      channelRef.current['channel2']?.close();
    }
  })

  return (
    <div>
      <div className={styles['frame-builder']}>
        <h3>Builder Messages</h3>
        <div className={styles['frame-parent']}>
          <ul>
            {messages.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
        <div className={styles['frame-content']}>
          <iframe ref={iFrameRef} src="/brodcast/view"></iframe>
        </div>
      </div>
      <footer style={{ position: 'fixed', display: 'flex', bottom: 0, gap:16, height: '300px', width: '100%', background: '#2d2d2d7b', backdropFilter: 'blur(10px)', padding: 24 }}>
        <button style={{ width: 150, height: 50 }} onClick={() => channelRef.current['channel1'].send('Iframe 🛺', 'pong', { time: Date.now() })}>
          Send to iFrame channel1
        </button>
         <button style={{ width: 150, height: 50 }} onClick={() => channelRef.current['channel1'].send('Iframe ⚽️', 'pong', { time: Date.now(), data: { request: 'UPDATE_CREDIT_CARD_COMPONENTS' } })}>
          Send to iFrame channel2
        </button>
      </footer>
    </div>
  );
}

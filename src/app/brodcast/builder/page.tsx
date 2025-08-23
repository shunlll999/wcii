/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './layout.module.css';
import { createSecureChannel } from '@Shared/modules/channel';

type SecureChannel = {
  send: (to: string, event: string, payload?: any) => void;
  close: () => void;
};

export default function Builder() {
  const iFrameRef = useRef<HTMLIFrameElement | null>(null);
  const [messages, setMessage] = useState<string[]>([]);
  const channelRef = useRef<Record<string, SecureChannel | undefined>>({});

  useEffect(() => {
    // ✅ สร้าง instance แล้วเก็บทั้งในโลคัลตัวแปรและใน ref เพื่อให้ปุ่มเข้าถึงได้
    const ch1 = createSecureChannel('secure_channel_1', (message: any) => {
      setMessage(prev => [
        ...prev,
        `[channel1] From ${message.from}: ${JSON.stringify(message.payload)}`
      ]);
    });

    const ch2 = createSecureChannel('secure_channel_2', (message: any) => {
      setMessage(prev => [
        ...prev,
        `[channel2] From ${message.from}: ${JSON.stringify(message.payload)}`
      ]);
    });

    // เก็บลง ref สำหรับการใช้งานภายนอก (ปุ่มกด)
    channelRef.current.channel1 = ch1;
    channelRef.current.channel2 = ch2;

    return () => {
      // ✅ ใช้ snapshot (ch1/ch2) ใน cleanup แทนการอ้าง channelRef.current
      ch1?.close();
      ch2?.close();

      // (optional) เคลียร์ค่าใน ref ถ้าต้องการ
      delete channelRef.current.channel1;
      delete channelRef.current.channel2;
    };
  }, []); // ✅ รันครั้งเดียวตอน mount/unmount

  console.log(messages);

  return (
    <div>
      <div className={styles['frame-builder']}>
        <h3>Builder Messages</h3>
        <div className={styles['frame-parent']}>
          <ul>
            {messages.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
        <div className={styles['frame-content']}>
          <iframe ref={iFrameRef} src="/brodcast/view"></iframe>
        </div>
      </div>

      <footer
        style={{
          position: 'fixed',
          display: 'flex',
          bottom: 0,
          gap: 16,
          height: '300px',
          width: '100%',
          background: '#2d2d2d7b',
          backdropFilter: 'blur(10px)',
          padding: 24
        }}
      >
        <button
          style={{ width: 150, height: 50 }}
          onClick={() =>
            channelRef.current.channel1?.send('Iframe 🛺', 'pong', { time: Date.now() })
          }
        >
          Send to iFrame channel1
        </button>

        <button
          style={{ width: 150, height: 50 }}
          onClick={() =>
            channelRef.current.channel2?.send('Iframe ⚽️', 'pong', {
              time: Date.now(),
              data: { request: 'UPDATE_CREDIT_CARD_COMPONENTS' }
            })
          }
        >
          Send to iFrame channel2
        </button>
      </footer>
    </div>
  );
}

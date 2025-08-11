'use client';
import { onEventListener } from '@Controllers/navigation.controller';
import { useEffect, useState } from 'react';
import styles from './view.module.css';

export default function View() {
  const [presets, setPresets] = useState<any[]>([]);
  const handlePresetDispatch = (event: MessageEvent<onEventListener>) => {
    const { event: eventType, payload } = event.data;
    if (eventType === 'add-preset') {
      setPresets(prevPresets => [...prevPresets, payload.preset]);
    }
  }

  useEffect(() => {
    window.addEventListener('message', handlePresetDispatch);
    return () => {
      window.removeEventListener('message', handlePresetDispatch);
    };
  }, []);
  return (
    <div className={styles['view-body']}>
      {presets.map((preset, index) => (
        <div className={styles['view-preset']} key={index}>
          <h3>Preset {index + 1}</h3>
          <pre>{JSON.stringify(preset, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import styles from './layout.module.css';
import {
  navigationController,
} from '@Controllers/navigation.controller';
import { EVENTS } from '@Shared/constants/event';
import { inspectorController } from '@Controllers/inspector.controller';
import type { onDispachType, onEventListener } from '@Shared/type';

export default function Builder() {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const handlePresetDispatch = (event: CustomEvent<onDispachType>) => {
    const { type, payload } = event.detail;
    if (iFrameRef.current) {
      const messageData: onEventListener = {
        event: `${type}-preset`,
        payload,
      };
      iFrameRef.current.contentWindow?.postMessage(messageData, '*');
    }
  };

  useEffect(() => {
    navigationController.addPresetListener(EVENTS.ON_BUILDER_DISPATCH, data =>
      handlePresetDispatch(new CustomEvent(data.type, { detail: data }))
    );
    if (iFrameRef.current) {
      iFrameRef.current.contentWindow?.addEventListener('message', event => {
        if (event.data.event === EVENTS.ON_INSPECTOR_OPEN) {
          console.log('Inspector Opened:', event.data.payload);
          inspectorController.onOpenInpsector(event.data.payload.isOpen, event.data.payload.preset);
        }
      });
    }
  }, []);
  return (
    <div>
      Builder Me
      <div className={styles['frame-content']}>
        <iframe ref={iFrameRef} src="/view" style={{ padding: 0 }}></iframe>
      </div>
    </div>
  );
}

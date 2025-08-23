'use client';

import { useEffect, useRef } from 'react';
import styles from './layout.module.css';
import { navigationController } from '@Controllers/navigation.controller';
import { EVENTS } from '@Shared/constants/event';
import { inspectorController } from '@Controllers/inspector.controller';
import type { DispatchEventType } from '@Shared/type';
import { useAppDispatch } from '@Shared/hooks/useAppDispatch';

export default function Builder() {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const { appController } = useAppDispatch();
  const handlePresetDispatch = (event: CustomEvent<DispatchEventType>) => {
    if (iFrameRef.current) {
      const messageData: DispatchEventType = {
       ...event.detail
      };
      appController.sendMessage(iFrameRef.current, messageData);
    }
  };

  const onReciveveMessage = (data: DispatchEventType) => {
    if (data.event === EVENTS.ON_INSPECTOR_OPEN) {
      const command = data.payload.command;
      let isOpen: boolean | undefined;
      if (
        command &&
        'value' in command &&
        typeof command.value === 'object' &&
        command.value !== null
      ) {
        isOpen = (command.value as { isOpen?: boolean }).isOpen;
      }
      inspectorController.onOpenInpsector(isOpen ?? false, data.payload.preset);
    }
  };

  useEffect(() => {
    appController.addListener(EVENTS.ON_BUILDER_DISPATCH, data =>
      handlePresetDispatch(new CustomEvent(data.type, { detail: data }))
    );
    if (iFrameRef.current) {
      appController.receiveMessage(iFrameRef.current, onReciveveMessage);
    }
    return () => {
      appController.removeListener(EVENTS.ON_BUILDER_DISPATCH, (data) =>  handlePresetDispatch(new CustomEvent(data.type, { detail: data })));
      if (iFrameRef.current) {
        appController.removeListener('message', onReciveveMessage);
      }
    };
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

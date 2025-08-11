'use client';

import { use, useEffect, useRef } from "react";
import styles from "./layout.module.css";
import { EVENTS, navigationController, onDispachType, onEventListener } from "@Controllers/navigation.controller";


export default function Builder() {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const handlePresetDispatch = (event: CustomEvent<onDispachType>) => {
    const { type, payload } = event.detail;
    if (iFrameRef.current) {
      const messageData: onEventListener = {
        event: `${type}-preset`,
        payload
      }
      iFrameRef.current.contentWindow?.postMessage(messageData, '*');
    }
  };

  useEffect(() => {
    navigationController.addPresetListener(EVENTS.ON_BUILDER_DISPATCH, (data) => handlePresetDispatch(new CustomEvent(data.type, { detail: data })));
  }, []);
  return (
    <div>Builder Me
      <div className={styles['frame-content']}>
        <iframe ref={iFrameRef} src="/view" style={{ padding: 0 }}></iframe>
      </div>
    </div>
  )
}

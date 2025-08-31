/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { EVENTS } from "@Shared/constants/event";
import { createSecureChannel } from "@Shared/modules/channel";
import { DispatchEventType, PresetAction } from "@Shared/types/dispatch.type";
import { useEffect, useRef, useState } from "react";

const BroadcastView = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const channelsRef = useRef<{ [key: string]: any }>({});
  const [openInspector, setInpsector] = useState<boolean>(false);
  useEffect(() => {
    channelsRef.current['channel1'] = createSecureChannel('secure_channel_1', (msg) => {
      setMessages(prev => [...prev, `[channel1] From ${msg.from}: ${JSON.stringify(msg.payload)}`]);
    });

    channelsRef.current['channel2'] = createSecureChannel('secure_channel_2', (msg) => {
      setMessages(prev => [...prev, `[channel2] From ${msg.from}: ${JSON.stringify(msg.payload)}`]);
    });

    // channelsRef.current['channel1'].send('iframe', 'ready', { status: 'Iframe ready on channel1 🙏🏻' });
    // channelsRef.current['channel2'].send('iframe', 'ready', { status: 'Iframe ready on channel2 🐼' });

    return () => {
      channelsRef.current['channel1']?.close();
      channelsRef.current['channel2']?.close();
    }
  }, []);

  const onActionRequest = () => {
    setInpsector(!openInspector);
    // channelsRef.current['channel1'].send('iframe', 'REQUEST_INSPECTOR', { time: Date.now(), preset: 'default', action: 'open' })
  }

  console.log('openInspector', openInspector);
  console.log(messages);

  useEffect(() => {
    if (window.parent) {
      const messageData: DispatchEventType = {
        event: EVENTS.ON_INSPECTOR_OPEN,
        type: PresetAction.UPDATE,
        payload: {
          preset: 'default',
          action: PresetAction.UPDATE,
          command: {
            control: 'inspector',
            type: PresetAction.OPEN_INSPECTOR,
            value: { isOpen: openInspector },
          }
        },
      };
      channelsRef.current['channel1'].send('iframe', 'REQUEST_INSPECTOR', { time: Date.now(), ...messageData })
    }
  }, [openInspector])

  return (
    <div>
      <h1>View</h1>
      <h3>Messages</h3>
      <ul>
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <div style={{ display: 'flex', gap: 8, marginTop: 16  }}>
        <button onClick={() => channelsRef.current['channel1'].send('iframe', 'pong', { time: Date.now() })}>
          Send to channel1
        </button>
        <button onClick={() => channelsRef.current['channel2'].send('iframe', 'pong', { time: Date.now() })}>
          Send to channel2
        </button>
        <button onClick={onActionRequest}>
          request inspector
        </button>
      </div>
    </div>
  )
}

export default BroadcastView

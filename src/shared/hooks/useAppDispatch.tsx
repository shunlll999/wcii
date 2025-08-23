import { EVENTS } from '@Shared/constants/event';
import { DispatchEventType } from '@Shared/types/dispatch.type';


export function useAppDispatch() {
  const appController = {
    // Note: Internal communication with the app
    dispatch: ({ event, type, payload }: DispatchEventType) => {
      const customEvent = new CustomEvent(event, {
        detail: {
          event,
          type,
          payload,
        },
      });
      if (window !== undefined) {
        window.document.dispatchEvent(customEvent);
      }
    },
    addListener: (event: string, callback: (data: DispatchEventType) => void) => {
      if (window !== undefined) {
        window.document.addEventListener(event, (event: Event) => {
          const customEvent = event as CustomEvent<DispatchEventType>;
          if (callback) callback({ ...customEvent.detail });
        });
      }
    },
    removeListener: (event: string, callback: (data: DispatchEventType) => void) => {
      if (window !== undefined) {
        window.document.removeEventListener(event, (event: Event) => {
          const customEvent = event as CustomEvent<DispatchEventType>;
          if (callback) callback({ ...customEvent.detail });
        });
      }
    },
    //  Note: External communication with across the iFrame and the app
    sendMessage: (
      source: HTMLIFrameElement | (Window & typeof globalThis),
      messageData: DispatchEventType
    ) => {
      if (window !== undefined) {
        if ('contentWindow' in source && source.contentWindow) {
          source.contentWindow.postMessage(messageData, '*');
        } else {
          (source as Window).postMessage(messageData, '*');
        }
      }
    },
    receiveMessage: (
      source: HTMLIFrameElement | (Window & typeof globalThis),
      callback: (data: DispatchEventType) => void
    ) => {
      if (window !== undefined) {
        if ('contentWindow' in source && source.contentWindow) {
          source.contentWindow.addEventListener(
            EVENTS.MESSAGE,
            (event: Event) => {
              const messageEvent = event as MessageEvent<DispatchEventType>;
              if (callback) callback(messageEvent.data);
            }
          );
        } else {
          (source as Window).addEventListener(
            EVENTS.MESSAGE,
            (event: Event) => {
              const messageEvent = event as MessageEvent<DispatchEventType>;
              if (callback) callback(messageEvent.data);
            }
          );
        }
      }
    },
  };

  return {
    appController,
  };
}

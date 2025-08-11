import { EVENTS } from "@Shared/constants/event"

const onOpenInpsector = (isOpen: boolean, preset?: string) => {
  if (window) {
    const customEvent = new CustomEvent(EVENTS.ON_INSPECTOR_OPEN, {
      detail: { isOpen, preset }
    });
    window.document.dispatchEvent(customEvent);
  }
}

const addInspectorListener = (event: string, callback: (data: { isOpen: boolean }) => void) => {
  if (window !== undefined) {
    window.document.addEventListener(event, (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen: boolean }>;
      const { isOpen } = customEvent.detail;
      if (callback) callback({ isOpen });
    });
  }
}

const removeInspectorListener = (event: string, callback: (data: { isOpen: boolean }) => void) => {
  if (window !== undefined) {
    window.document.removeEventListener(event, (event: Event) => {
      const customEvent = event as CustomEvent<{ isOpen: boolean }>;
      const { isOpen } = customEvent.detail;
      if (callback) callback({ isOpen });
    });
  }
}

export const inspectorController = {
  onOpenInpsector,
  addInspectorListener,
  removeInspectorListener,
}

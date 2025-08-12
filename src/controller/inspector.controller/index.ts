import { EVENTS } from '@Shared/constants/event';
import { useAppDispatch } from '@Shared/hooks/useAppDispatch';
import { DispatchEventType, PresetAction } from '@Shared/type';

const { appController } = useAppDispatch();

const onOpenInpsector = (isOpen: boolean, preset?: string) => {
  if (window) {
    appController.sendMessage(window, {
      event: EVENTS.ON_INSPECTOR_OPEN,
      type: PresetAction.UPDATE,
      payload: {
        preset: preset ?? '',
        action: PresetAction.UPDATE,
        command: {
          control: 'inspector',
          type: PresetAction.OPEN_INSPECTOR,
          value: {
            isOpen,
          },
        },
      },
    });
  }
};

const addInspectorListener = (
  event: string,
  callback: (data: DispatchEventType) => void,
) => {
  if (window !== undefined) {
    appController.receiveMessage(window, (data: DispatchEventType) => {
      if (data.event === event) {
        if (callback) {
          const customEvent: DispatchEventType = {
            event,
            type: data.type,
            payload: {
              preset: data.payload.preset,
              action: data.payload.action,
              command: data.payload.command,
            },
          };
          callback(customEvent);
        }
      }
    });
  }
};

export const inspectorController = {
  onOpenInpsector,
  addInspectorListener,
};

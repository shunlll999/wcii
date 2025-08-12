import { EVENTS } from "@Shared/constants/event";
import { useAppDispatch } from "@Shared/hooks/useAppDispatch";
import { DispatchEventType, PresetAction } from "@Shared/type";

const addPreset = (preset: string, action: PresetAction) => {
  const dispatch = useAppDispatch();
  dispatch.appController.dispatch({
    event: EVENTS.ON_BUILDER_DISPATCH,
    type: action,
    payload: { preset, action }
  });
}

const addPresetListener = (event: string, callback: (data: DispatchEventType) => void) => {
  const { appController } = useAppDispatch();
  appController.addListener(event, (data: DispatchEventType) => {
    if (callback) callback(data);
  });
}

export const navigationController = {
  addPreset,
  addPresetListener,
};

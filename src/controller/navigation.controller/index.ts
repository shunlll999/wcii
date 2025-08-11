import { useAppDispatch } from "@Shared/hooks/useAppDispatch";
import { onDispachType, PresetAction } from "@Shared/type";

const addPreset = (preset: string, action: PresetAction) => {
  const dispatch = useAppDispatch();
  dispatch.navigationController.dispatch({
    type: action,
    payload: { preset, action }
  });
}

const addPresetListener = (event: string, callback: (data: onDispachType) => void) => {
  if (window !== undefined) {
    window.document.addEventListener(event, (event: Event) => {
      const customEvent = event as CustomEvent<onDispachType>;
      const { type, payload } = customEvent.detail;
      if (callback) callback({ type, payload });
    });
  }
}

export const navigationController = {
  addPreset,
  addPresetListener,
};

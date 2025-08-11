export const EVENTS =  {
  ON_BUILDER_DISPATCH: 'onBuilderDispatch',
}

export enum PresetAction {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
}
export type onDispachType = {
  type: PresetAction;
  payload: {
    preset: string;
    action: PresetAction;
  };
}

export type onEventListener = {
  event: string;
  payload: {
    preset: string;
    action: PresetAction;
  };
}


const onClick = (event: React.MouseEvent<HTMLDivElement>, callback: () => void) => {
  // Prevent default link behavior
  event.preventDefault();

  // Handle the click event, e.g., navigate to a different page or perform an action
  console.log('Link clicked:', event.currentTarget.dataset.value);
  if (callback) {
    callback();
  }
}

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
  onClick,
  addPreset,
  addPresetListener,
};

function useAppDispatch() {
  const navigationController = {
    dispatch: ({ type, payload }: onDispachType) => {
      const customEvent = new CustomEvent(EVENTS.ON_BUILDER_DISPATCH, {
      detail: {
        type,
        payload
      }
    });
    if (window !== undefined) {
      window.document.dispatchEvent(customEvent);
    }
    },
  }

  return {
    navigationController
  }
}


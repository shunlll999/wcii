export enum PresetAction {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
  OPEN_INSPECTOR = 'open-inspector',
  CLOSE_INSPECTOR = 'close-inspector',
  ADD_COMMAND = 'add-command',
}

export type CommmandInspector = {
  control: string;
  type: PresetAction;
  value: {
    isOpen: boolean;
  };
};

export type CommmandActionBar = {
  whom: string;
  type: PresetAction;
  preset: string;
};

export type DispatchEventType<T = CommmandInspector | CommmandActionBar> = {
  event: string;
  type: PresetAction;
  payload: {
    preset: string;
    action: PresetAction;
    command?: T;
  };
}

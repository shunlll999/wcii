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

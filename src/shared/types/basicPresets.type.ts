type PresetType = {
  id: number,
  name: string,
  description: string,
  code: string,
  icon?: string
}

type ComponentsResponseType = {
  code: string,
  template: string,
  id: number,
  error?: string
}

interface IPresetQueue {
 seq: number,
 data: PresetType[]
}

type PresetMode = {
  basic: IPresetQueue,
  form: IPresetQueue,
  extra: IPresetQueue
}

type PresetResponseType = {
  data: PresetMode,
  type: string
}


export type {
  PresetType,
  PresetResponseType,
  ComponentsResponseType
}

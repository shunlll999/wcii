type PresetType = {
  id: number,
  name: string,
  description: string,
  code: string
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
  PresetResponseType
}

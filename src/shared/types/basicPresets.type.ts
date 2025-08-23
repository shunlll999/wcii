type PresetType = {
  id: number,
  name: string,
  description: string,
  code: string
}

type PresetResponseType = {
  data: PresetType[],
  type: string
}


export type {
  PresetType,
  PresetResponseType
}

type NodeType = "text" | "button" | "image" | "video" | "container" | "column" | "row"

type PresetType = {
  id: number,
  name: string,
  code: string,
  description?: string,
  icon?: string,
  sourceId?: string,
  props?: Record<string, unknown>;
  children?: PresetType[],
  metadata?: Record<string, unknown>,
}

type ComponentsResponseType = {
  code: string,
  template: string,
  id: number,
  error?: string
}

type CSSResponseType = {
  css: string,
  error?: string
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

interface ILayoutNode {
  id: string;
  type: NodeType;
  props?: Record<string, unknown>;
  children?: ILayoutNode[];
}

interface IPresetQueue {
 seq: number,
 data: PresetType[]
}


export type {
  PresetType,
  PresetResponseType,
  ComponentsResponseType,
  NodeType,
  ILayoutNode,
  CSSResponseType
}

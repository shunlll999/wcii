export type PaletteItem = {
  type: 'text' | 'button' | 'image' | 'video' | 'container' | 'column' | 'row';
  label: string;
  payload?: unknown;
};

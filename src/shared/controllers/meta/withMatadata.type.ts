export type Metadata = {
  name: string;
  description: string;
  code: string;
  type: 'base' | 'widget' | 'layout';
  icon?: string;
  id?: number;
};

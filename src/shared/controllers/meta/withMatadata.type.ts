export type Metadata = {
  name: string;
  description: string;
  code: string;
  type: 'base' | 'widget' | 'layout';
  icon?: string;
  id?: number;
  props?: {
    [key: string]:
      | { type: 'string' | 'number' | 'boolean' | 'ReactNode' | 'className' | 'array' }
      | Record<string, unknown>; // เผื่อกรณีซ้อน
  }
};

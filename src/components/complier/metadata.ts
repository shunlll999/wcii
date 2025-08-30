import type { ComponentType } from 'react';

export type ComponentMetadata = {
  name: string;
  category: string;
  description?: string;
  props?: Record<
    string,
    | { type: 'string' | 'number' | 'boolean' | 'ReactNode' | 'className' }
    | Record<string, unknown> // เผื่อกรณีซ้อน
  >;
};

export type WithMetadata<P = Record<string, unknown>> =
  ComponentType<P> & { metadata?: ComponentMetadata };

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
export function isComponent(v: unknown): v is ComponentType<Record<string, unknown>> {
  return typeof v === 'function';
}

export function hasMetadata(v: unknown): v is WithMetadata {
  return isComponent(v) && 'metadata' in (v as object);
}

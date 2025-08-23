/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import React from 'react';

const EXPOSED_KEY = Symbol('exposed');

export interface ParamMeta {
  name: string;
  type: 'string' | 'number' | 'boolean';
}

export interface ExposedMeta {
  key: string;
  kind: 'property' | 'method';
  params?: ParamMeta[];
  render?: (instance: any) => React.ReactNode;
}

export function Expose(options?: {
  params?: ParamMeta[];
  render?: (instance: any) => React.ReactNode;
}) {
  return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
    const exposed: ExposedMeta[] = Reflect.getMetadata(EXPOSED_KEY, target) || [];
    exposed.push({
      key: propertyKey,
      kind: descriptor ? 'method' : 'property',
      params: options?.params,
      render: options?.render,
    });
    Reflect.defineMetadata(EXPOSED_KEY, exposed, target);
  };
}

export function getExposedProperties(instance: any): ExposedMeta[] {
  const proto = Object.getPrototypeOf(instance);
  return Reflect.getMetadata(EXPOSED_KEY, proto) || [];
}

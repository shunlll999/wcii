'use client';
import React, { useMemo } from 'react';
import * as Babel from '@babel/standalone';
import type { ComponentType, ReactElement } from 'react';
import { Button } from '@Shared/components/ui';
import { ComponentMetadata, hasMetadata, isComponent, isObject, WithMetadata } from './metadata';



// ---------- types ----------
type Props = {
  source: string;
  props?: Record<string, unknown>;
  onMetadata?: (meta?: ComponentMetadata) => void;
};
type ComplieResult = {
  Component: ComponentType<Record<string, unknown>>;
  metadata?: ComponentMetadata;
}
type Registry = Readonly<Record<string, ComponentType<Record<string, unknown>>>>;
type CJSModule = { exports: unknown };
// ---------- registry ----------
const registry: Registry = Object.freeze({ Button });

// ---------- component ----------
export default function StringCompiler({ source, props, onMetadata }: Props) {
  const { Component, metadata } = useMemo<ComplieResult>(() => {
    const keys = Object.keys(registry);
    const prelude =
      `const { ${keys.join(', ')} } = __SCOPE__;\n`;

    const transformed = Babel.transform(prelude + source, {
      presets: [
        ['typescript', { allExtensions: true, isTSX: true }],
        ['react', { runtime: 'classic' }],
      ],
      plugins: ['transform-modules-commonjs'],
    });

    if (!transformed.code) {
      throw new Error('Empty complied code, Check your source syntax.');
    }

    const codeStr = typeof transformed.code === 'string' ? transformed.code : '';
    const mod: CJSModule = { exports: {} };

    // 2) evaluate CJS — พารามิเตอร์มี __SCOPE__ อยู่แล้ว
    const evaluator = new Function(
      'React',
      '__SCOPE__',
      'module',
      'exports',
      codeStr
    ) as (
      r: typeof React,
      scope: Registry,
      m: CJSModule,
      e: unknown
    ) => unknown;

    evaluator(React, registry, mod, mod.exports);
    const pick = (exp: unknown): { comp: ComponentType<Record<string, unknown>> | null; metadata?: ComponentMetadata } => {
      if (isComponent(exp)) {
        return { comp: exp, metadata: hasMetadata(exp) ? exp.metadata : undefined };
      }

      if (React.isValidElement(exp)) {
        const element = exp as ReactElement;
        const innerMetadata = hasMetadata(element.type) ? element.type.metadata : undefined;
        const wrapped: ComponentType = () => element;
        (wrapped as WithMetadata).metadata = innerMetadata;
        return { comp: wrapped, metadata: innerMetadata };
      }

      if (isObject(exp) && 'default' in exp) {
        return pick((exp as Record<string, unknown>).default);
      }
      return { comp: null };
    }

    const { comp, metadata } = pick(mod.exports);
   if (!comp) {
      throw new Error(`Compiled result is not a React component. Expect 'export default function ...' or 'export default () => <div/>'.`);
   }

   return { Component: comp, metadata };
  }, [source]);

  if (onMetadata) onMetadata(metadata);

  return <Component {...props} />;
}

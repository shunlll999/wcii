/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useMemo } from 'react';
import * as Babel from '@babel/standalone';
import type { ComponentType, ReactElement } from 'react';
import { Button } from '@Shared/components/ui';
import {
  ComponentMetadata,
  hasMetadata,
  isComponent,
  isObject,
  PropsType,
  WithMetadata,
} from './metadata';

// ---------- helpers (ใหม่) ----------
function djb2(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) + hash + str.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

// prefix selector แบบง่าย: เติม `:where(.SCOPE)` หน้า selector ปกติ
function prefixCss(css: string, scopeClass: string): string {
  // จัดการ @media / @supports โดยคงบล็อกไว้ และแปลง selector ภายใน
  const transformBlock = (block: string): string => {
    return block.replace(/(^|})\s*([^@}][^{]+)\s*\{/g, (_m, before, selectors) => {
      const scoped = selectors
        .split(',')
        .map((s: string) => `:where(.${scopeClass}) ${s.trim()}`)
        .join(', ');
      return `${before} ${scoped} {`;
    });
  };

  // แยกบล็อก @xxx ออก แล้วแปลงเฉพาะส่วนที่เป็น selector ธรรมดา
  return css
    .replace(/@(?:media|supports)[^{]+\{([\s\S]*?)\}/g, (m, inner) => {
      const scopedInner = transformBlock(inner);
      return m.replace(inner, scopedInner);
    })
    .replace(/(^|})\s*([^@}][^{]+)\s*\{/g, (_m, before, selectors) => {
      const scoped = selectors
        .split(',')
        .map((s: string) => `:where(.${scopeClass}) ${s.trim()}`)
        .join(', ');
      return `${before} ${scoped} {`;
    });
}

function toArray<T>(v?: T | T[]): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// ---------- types ----------
type Props = {
  source: string;
  props?: Record<string, unknown>;
  onMetadata?: (meta?: ComponentMetadata) => void;

  // เพิ่มใหม่
  styleSheet?: string | string[];
  cssScope?: 'global' | 'scoped';
};

type ComplieResult = {
  Component: ComponentType<Record<string, unknown>>;
  metadata?: ComponentMetadata;
};
type Registry = Readonly<Record<string, React.ComponentType<never>>>;
type CJSModule = { exports: unknown };

// ---------- registry ----------
const registry: Registry = Object.freeze({ Button });

// ---------- component ----------
export default function StringCompiler({
  source,
  props,
  onMetadata,
  styleSheet,
  cssScope = 'global',
}: Props) {
  const { Component, metadata } = useMemo<ComplieResult>(() => {
    const keys = Object.keys(registry);
    const prelude = `const { ${keys.join(', ')} } = __SCOPE__;\n`;

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
    const evaluator = new Function('React', '__SCOPE__', 'module', 'exports', codeStr) as (
      r: typeof React,
      scope: Registry,
      m: CJSModule,
      e: unknown
    ) => React.ReactNode;

    evaluator(React, registry, mod, mod.exports);

    const pick = (
      exp: unknown
    ): { comp: ComponentType<Record<string, unknown>> | null; metadata?: ComponentMetadata } => {
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
    };

    const { comp, metadata } = pick(mod.exports);
    if (!comp) {
      throw new Error(
        `Compiled result is not a React component. Expect 'export default function ...' or 'export default () => <div/>'.`
      );
    }

    return { Component: comp, metadata };
  }, [source]);

  useEffect(() => {
    const mergedProps = { ...props };
    if (onMetadata && metadata && typeof metadata.name === 'string') {
      onMetadata({
        ...metadata,
        name: metadata.name,
        props: mergedProps as PropsType,
      });
    }
  }, []);

  // ---- CSS injection (ใหม่) ----
  const sheets = toArray(styleSheet);
  const hasCss = sheets.length > 0;

  if (!hasCss) {
    // ไม่มี CSS — พฤติกรรมเดิม
    return <Component {...props} />;
  }

  if (cssScope === 'global') {
    // ฉีดเป็น global <style> ตรง ๆ
    return (
      <>
        {sheets.map((css, idx) => (
          <style key={idx} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
        <Component {...props} />
      </>
    );
  }

  // scoped mode — สร้างคลาสเฉพาะ แล้ว prefix ทุก selector
  const scopeClass = `sc-${djb2(sheets.join('\n'))}`;
  const scopedCss = sheets.map(css => prefixCss(css, scopeClass)).join('\n');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      <div className={scopeClass}>
        <Component {...props} />
      </div>
    </>
  );
}

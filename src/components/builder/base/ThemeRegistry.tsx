'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache, { EmotionCache } from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';

type ThemeRegistryProps = {
  children: React.ReactNode;
};

export const ThemeRegistry: React.FC<ThemeRegistryProps> = ({ children }) => {
  const [cache] = React.useState<EmotionCache>(() => {
    const c = createCache({ key: 'mui', prepend: true });
    // c.compat = true; // (optional) บางโปรเจกต์ MUI แนะนำเปิด compat
    return c;
  });

  useServerInsertedHTML(() => {
    const { inserted, key } = cache; // inserted: Record<string, string | true>
    const names = Object.keys(inserted);

    // filter เฉพาะค่าที่เป็น string เพราะบาง key จะเป็น true
    const css = names
      .map(name => inserted[name])
      .filter((v): v is string => typeof v === 'string')
      .join(' ');

    return (
      <style
        data-emotion={`${key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: css }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

'use client';

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";

type ThemeRegistryProps = {
  children: React.ReactNode
}

export const ThemeRegistry = ({ children }: ThemeRegistryProps) => {
  const [cache] = useState(() => createCache({ key: 'mui', prepend: true }));

  useServerInsertedHTML(() => (
    <style data-emotion={`${cache.key} ${Object.keys((cache as any).inserted).join(' ')}}`} dangerouslySetInnerHTML={{ __html: Object.values((cache as any).inserted).join(' ') }} />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>
};

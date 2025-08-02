'use client';

import { useEffect } from 'react';

export default function TitleAnimator({ slug }: { slug: string }) {
  useEffect(() => {
    let i = 0;
    const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
    const interval = setInterval(() => {
      document.title = `${frames[i % frames.length]} - ${String(slug).toLocaleUpperCase()}`;
      i++;
    }, 300);

    return () => clearInterval(interval);
  }, [slug]);

  return null;
}

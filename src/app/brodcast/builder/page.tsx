'use client';

import { useRef } from 'react';
import styles from './layout.module.css';

export default function Builder() {
  const iFrameRef = useRef<HTMLIFrameElement>(null);

  return (
    <div>
      Hello
    </div>
  );
}

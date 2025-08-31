'use client';

import styles from './base.module.css'

export const Studio = () => {
  return (
    <div>
      Builder Me
      <div className={styles['frame-content']}>
        <iframe src="/view/iframe-builder" style={{ padding: 0 }}></iframe>
      </div>
    </div>
  )
};

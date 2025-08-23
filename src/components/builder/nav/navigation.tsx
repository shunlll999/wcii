'use client';
import { PresetResponseType } from "@Shared/types";
import styles from './navigation.module.css'
type NavigationProps = {
  presets: PresetResponseType;
}
export const Navigation = ({ presets }: NavigationProps) => {
const { data } = presets
console.log('PresetMode', data);
  return (
    <div className={styles.nav}>
      <div>
        <div className={styles['section-header']}>Hierarchy</div>
        <div className={styles['section-content']}>Item 1</div>
      </div>
      <div>
        {Object.entries(data).sort(([, a], [, b]) => a.seq - b.seq).map(([key, item]) => (
          <div key={key} >
            <div className={styles['section-header']}>{key}</div>
            <div className={styles['section-item']}>
              {item.data.map(data => <div key={data.id} className={styles['section-content']}>{data.name}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

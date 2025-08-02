import { ReactNode } from 'react';
import styles from './link.module.css';
import { EventHandlers } from '@Shared/types/event';

type LinkProps = {
  children: ReactNode;
  onController?: EventHandlers;
  'data-value'?: string;
}

const Link = ({ children, onController, ...props }: LinkProps) => {
  return (
    <div data-value={props['data-value']} className={styles['link-container']} onClick={onController?.onClick}>
      {children}
    </div>
  );
}

export default Link;

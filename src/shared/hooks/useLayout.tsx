import { useEffect, useState } from 'react';
import { positionStore } from '@Shared/stores/layoutStore';
import { createSecureChannel } from '@Shared/modules/channel';
import { PresetType } from '@Shared/types';
import { CHANNEL_NAME } from '@Shared/constants';

export function useLayout() {
  const [layouts, setLayouts] = useState(() => positionStore.getState().layouts);

  useEffect(() => {

    const channel = createSecureChannel<PresetType[]>(CHANNEL_NAME.STORE, (message) => {
      setLayouts(message.payload);
    });

    positionStore.persist?.onFinishHydration?.((s) => {
      setLayouts(s?.layouts ?? positionStore.getState().layouts);
    });

    const unsubscribe = positionStore.subscribe(
      (s) => s.layouts,
      (next, prev) => {
        if (next !== prev) setLayouts(next);
      },
      {
        fireImmediately: true,
      }
    );
    return () => {
      channel.close();
      unsubscribe();
    };
  }, []);

  return layouts;
}

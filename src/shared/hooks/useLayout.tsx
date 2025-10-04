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

    // 2.1 ถ้ามี persist: อัปเดตครั้งแรกหลัง hydrate
    positionStore.persist?.onFinishHydration?.((s) => {
      setLayouts(s?.layouts ?? positionStore.getState().layouts);
    });

    // 2.2 subscribe เฉพาะ layouts และยิงครั้งแรกทันที
    const unsubscribe = positionStore.subscribe(
      (s) => s.layouts,
      (next, prev) => {
        if (next !== prev) setLayouts(next);
      },
      {
        fireImmediately: true,      // ยิงครั้งแรกทันทีด้วยค่า current
        // equalityFn: shallow หรือ custom ก็ได้ ถ้าอยากยิงเฉพาะเมื่อ length/ids เปลี่ยน
        // equalityFn: (a, b) => a === b,
      }
    );
    return () => {
      channel.close();
      unsubscribe();
    };
  }, []);

  return layouts;
}

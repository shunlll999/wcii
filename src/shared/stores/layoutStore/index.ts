import { createStore } from 'zustand/vanilla'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { PresetType } from '@Shared/types'
import { createSecureChannel } from '@Shared/modules/channel'
import { CHANNEL_NAME } from '@Shared/constants'
import { DEFAULT_SECURE_CODE } from '@Shared/modules/constants/channel.const'

type LayoutStoreState = { layouts: PresetType[] }
type LayoutStoreActions = {
  setLayout: (nextPosition: LayoutStoreState['layouts']) => void
}

type LayoutStore = LayoutStoreState & LayoutStoreActions

const positionStore = createStore<LayoutStore>()(
  subscribeWithSelector(persist(
    (set) => ({
      layouts: [],
      setLayout: (layout) => set({ layouts: layout }),
    }),
    { name: 'position-storage' },
  )),
)

const storeChannel = createSecureChannel<PresetType[]>(CHANNEL_NAME.STORE, () => {}, DEFAULT_SECURE_CODE);


const unsubPositionStore: () => void = positionStore.subscribe((state: LayoutStoreState) => {
  storeChannel.send(CHANNEL_NAME.STORE, 'STORE', state.layouts);
});

export { positionStore, unsubPositionStore }

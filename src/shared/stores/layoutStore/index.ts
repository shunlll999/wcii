import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { PresetType } from '@Shared/types'

type LayoutStoreState = { layouts: PresetType[] }

type LayoutStoreActions = {
  setLayout: (nextPosition: LayoutStoreState['layouts']) => void
}

type LayoutStore = LayoutStoreState & LayoutStoreActions

const positionStore = createStore<LayoutStore>()(
  persist(
    (set) => ({
      layouts: [],
      setLayout: (layout) => set({ layouts: layout }),
    }),
    { name: 'position-storage' },
  ),
)
export { positionStore }

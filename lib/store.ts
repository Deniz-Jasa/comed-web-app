import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewState {
  isPhysicianView: boolean;
  toggleView: () => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      isPhysicianView: false,
      toggleView: () => set((state) => ({ isPhysicianView: !state.isPhysicianView })),
    }),
    {
      name: 'view-store',
    }
  )
);
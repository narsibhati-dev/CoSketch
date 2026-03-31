import { create } from 'zustand';

interface ViewportStore {
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useViewportStore = create<ViewportStore>(set => ({
  zoom: 1,
  setZoom: zoom => set({ zoom }),
}));

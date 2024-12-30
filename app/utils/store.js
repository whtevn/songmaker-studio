import { create } from 'zustand';

const useStore = create((set) => ({
  selectedScale: null,
  setSelectedScale: (scale) => set({ selectedScale: scale }),
  clearSelectedScale: () => set({ selectedScale: null }),
}));

export default useStore;


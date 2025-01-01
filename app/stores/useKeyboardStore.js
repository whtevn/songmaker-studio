import { create } from 'zustand';

const useKeyboardStore = create((set) => ({
  selectedNotes: [],
  setSelectedNotes: (note) =>
    set((state) => ({
      selectedNotes: state.selectedNotes.includes(note)
        ? state.selectedNotes.filter((n) => n !== note)
        : [...state.selectedNotes, note],
    })),
  matchingScales: [],
  setMatchingScales: (scales) => set(() => ({ matchingScales: scales })),
  activeModes: ["ionian", "aeolian"],
  setActiveModes: (modes) => set(() => ({ activeModes: modes })),
  handleFindScales: (findScalesContainingNotes) =>
    set((state) => ({
      matchingScales: findScalesContainingNotes(state.selectedNotes, {
        modes: state.activeModes,
      }),
    })),
  handleReset: () =>
    set(() => ({
      selectedNotes: [],
      matchingScales: [],
      activeModes: ["ionian", "aeolian"],
    })),
}));

export default useKeyboardStore;

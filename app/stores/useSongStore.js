// stores/useSongStore.js
import { create } from 'zustand';

const useSongStore = create((set) => ({
  selectedScale: null,
  setSelectedScale: (scale) => set({ selectedScale: scale }),
  clearSelectedScale: () => set({ selectedScale: null }),
  song: {
    tempo: 120,
    root: "C",
    mode: "Ionian",
    sections: [],
    sectionOrder: [],
    chordBank: [],
    recordings: [],
  },
  setSong: (song) => set({ song }),
  updateSong: (updates) =>
    set((state) => ({ song: { ...state.song, ...updates } })),
  addSection: (section) =>
    set((state) => ({
      song: {
        ...state.song,
        sections: [...state.song.sections, section],
        sectionOrder: [...state.song.sectionOrder, section.id],
      },
    })),
}));

export default useSongStore;


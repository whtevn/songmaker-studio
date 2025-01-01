import { create } from 'zustand';

const useSongInProgress = create((set) => ({
  title: "",
  tempo: 120, // Default tempo
  duration: 260, // Time in seconds
  timeSignature: "4/4", // Default time signature
  key: { root: "C", mode: "Ionian" }, // Default key
  lyrics: "",

  setTitle: (title) => set(() => ({ title })),
  setLyrics: (lyrics) => set(() => ({ lyrics })),
  setDuration: (duration) => set(() => ({ duration })),
  setTempo: (tempo) => set(() => ({ tempo })),
  setTimeSignature: (timeSignature) => set(() => ({ timeSignature })),
  setKey: (key) => set(() => ({ key })),

  resetSong: () =>
    set(() => ({
      title: "",
      lyrics: "",
      tempo: 120,
      duration: 260,
      timeSignature: "4/4",
      key: { root: "C", mode: "Ionian" },
    })),
}));

export default useSongInProgress;


import { create } from 'zustand';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function purifySection(section){
  const { id, measures } = section;
  return { ...section, id: (id || generateUUID()), measures: (measures || 4) }
}

const useSongInProgress = create((set) => ({
  title: "",
  tempo: 120, // Default tempo
  duration: 260, // Time in seconds
  measures: 130,
  timeSignature: "4/4", // Default time signature
  key: { root: "C", mode: "Ionian" }, // Default key
  lyrics: "",
  sections: [
    {
      id: generateUUID(),
      type: "Intro",
      measures: 16,
      color: "pink",
    },
    {
      id: generateUUID(),
      type: "Outro",
      measures: 16, 
      color: "violet",
    },
  ],
  setTitle: (title) => set(() => ({ title })),
  setLyrics: (lyrics) => set(() => ({ lyrics })),
  setDuration: (duration) => set(() => ({ duration })),
  setTempo: (tempo) => set(() => ({ tempo })),
  setTimeSignature: (timeSignature) => set(() => ({ timeSignature })),
  setKey: (key) => set((state) => ({ key: { ...state.key, ...key } })), 
  applyLyrics: (n, lyrics) => set((state) => {
    const updatedSections = [...state.sections];
    updatedSections[n] = { ...updatedSections[n], lyrics };

    return { sections: updatedSections };
  }),

  setSections: (newSections) => set({ sections: newSections.map(purifySection) }),

  resetSong: () =>
    set(() => ({
      title: "",
      lyrics: "",
      tempo: 120,
      measures: 130,
      duration: 260,
      timeSignature: "4/4",
      key: { root: "C", mode: "Ionian" },
    })),
}));

export default useSongInProgress;


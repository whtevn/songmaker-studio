import { create } from 'zustand';
import ScaleFinder from '~/utils/scales'

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

const useSongInProgress = create((set, get) => ({
  title: "",
  tempo: 120, // Default tempo
  duration: 260, // Time in seconds
  measures: 130,
  timeSignature: "4/4", // Default time signature
  key: { root: "C", mode: "Ionian" }, // Default key
  lyrics: "",
  lyricVersions: [],
  addLyricVersion: (lyrics) => {
    const timestamp = Date.now();
    return set((state) => ({
      lyricVersions: [...state.lyricVersions, {lyrics, timestamp}],
    }))
  },
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
  updateSection: (section) => set((state) => {
    const updatedSections = state.sections.map((s) =>
      s.id === section.id ? { ...s, ...section } : s
    );

    return { ...state, sections: updatedSections };
  }),

  setSections: (newSectionsOrUpdater) => set((state) => {
    const newSections =
      typeof newSectionsOrUpdater === "function"
        ? newSectionsOrUpdater(state.sections)
        : newSectionsOrUpdater;
    return { sections: newSections.map(purifySection) };
  }),
  getSongDuration: () => {
    const { sections, tempo, timeSignature } = get();

    // Parse beats per measure from the timeSignature
    const [beatsPerMeasure] = timeSignature.split("/").map(Number);

    // Total measures in all sections
    const totalMeasures = sections.reduce(
      (sum, section) => sum + (parseInt(section.measures) || 0),
      0
    );

    // Calculate the duration in seconds
    const durationInSeconds = (totalMeasures * beatsPerMeasure) / tempo * 60;

    return durationInSeconds;
  },
  getSelectedScale: () => {
    const { key } = get();
  },

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


import { create } from 'zustand';
import ScaleFinder from '~/utils/scales'
import { nanoid } from "nanoid";


function purifySection(section){
  const { id, measures } = section;
  return { ...section, id: (id || nanoid()), measures: (measures || 4) }
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
  lyricVersionTally: 0,
  selectedScale: null,
  setSelectedScale: (scale) => set({ selectedScale: scale }),
  clearSelectedScale: () => set({ selectedScale: null }),
  addLyricVersion: (lyrics) => {
    const timestamp = Date.now();
    const id = nanoid();
    return set((state) => {
      const lyricVersionTally = state.lyricVersionTally+1
      const name = `Version #${lyricVersionTally}`
      return {
        lyricVersionTally,
        lyricVersions: [...state.lyricVersions, {id, lyrics, timestamp, versionNumber: lyricVersionTally, name}],
      }
    })
  },
  getSortedLyricVersions: (sortBy = 'timestamp') => {
    return get().lyricVersions.slice().sort((a, b) => b[sortBy] - a[sortBy]);
  },
  setLyricVersion: (updatedVersion) => {
    set((state) => {
      const updatedVersions = state.lyricVersions.map((version) =>
        version.id === updatedVersion.id ? updatedVersion : version
      );

      return {
        lyricVersions: updatedVersions,
      };
    });
  },
  deleteLyricVersion: (id) => {
    set((state) => ({
      lyricVersions: state.lyricVersions.filter((version) => version.id !== id),
    }));
  },
  getLyricVersion: (id) => {
    return get().lyricVersions.find((version) => version.id === id);
  },


  sections: [
    {
      id: nanoid(),
      type: "Intro",
      measures: 16,
      color: "pink",
    },
    {
      id: nanoid(),
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


import { nanoid } from "nanoid";

function purifySection(section) {
  const { id, measures } = section;
  return { ...section, id: id || nanoid(), measures: measures || 4 };
}
export const WRITING = "writing"
export const RECORDING = "recording"
export const RECORDED = "recorded"
export const RELEASED = "released"
export const STATUS_SET = [
  WRITING,
  RECORDING,
  RECORDED,
  RELEASED
]

export class Song {
  constructor(songData = {}) {
    const defaultData = {
      localId: nanoid(),
      title: "Untitled Song",
      status: WRITING,
      tempo: 120,
      duration: 260,
      measures: 130,
      timeSignature: "4/4",
      key: { root: "C", mode: "Ionian" },
      lyrics: "",
      lyricVersions: [],
      lyricVersionTally: 0,
      sections: [],
    };

    Object.assign(this, defaultData, songData);
  }

  // === Lyric Versions ===
  addLyricVersion(lyrics) {
    const timestamp = Date.now();
    const id = nanoid();
    const versionNumber = ++this.lyricVersionTally;
    const name = `Version #${versionNumber}`;

    this.lyricVersions.push({ id, lyrics, timestamp, versionNumber, name });
  }

  getSortedLyricVersions(sortBy = "timestamp") {
    return [...this.lyricVersions].sort((a, b) => b[sortBy] - a[sortBy]);
  }

  setLyricVersion(updatedVersion) {
    this.lyricVersions = this.lyricVersions.map((version) =>
      version.id === updatedVersion.id ? updatedVersion : version
    );
  }

  deleteLyricVersion(id) {
    this.lyricVersions = this.lyricVersions.filter(
      (version) => version.id !== id
    );
  }

  // === Sections ===
  updateSection(section) {
    this.sections = this.sections.map((s) =>
      s.id === section.id ? { ...s, ...section } : s
    );
  }

  setSections(newSectionsOrUpdater) {
    const newSections =
      typeof newSectionsOrUpdater === "function"
        ? newSectionsOrUpdater(this.sections)
        : newSectionsOrUpdater;

    this.sections = newSections.map(purifySection);
  }

  applyLyrics(index, lyrics) {
    this.sections[index] = { ...this.sections[index], lyrics };
  }

  getDuration() {
    const [beatsPerMeasure] = this.timeSignature.split("/").map(Number);
    const totalMeasures = this.sections.reduce(
      (sum, section) => sum + (parseInt(section.measures) || 0),
      0
    );
    return (totalMeasures * beatsPerMeasure) / this.tempo * 60;
  }
}


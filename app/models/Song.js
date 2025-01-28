import { BaseObject } from "./BaseObject";

export class Song extends BaseObject {
  constructor(songData = {}) {
    super(songData);

    const defaultData = {
      title: "Untitled Song",
      status: "writing",
      tempo: 120,
      measures: 0,
      timeSignature: "4/4",
      key: { root: "C", mode: "Ionian" },
      lyrics: "",
      sections: [], // List of { SongSectionId, Order }
      lyricVersionTally: 0,
      lyricVersions: [], // List of { LyricVersionId, Order }
      albums: [], // List of { LyricVersionId, Order }
    };

    Object.assign(this, defaultData, songData);
  }
}

// Define `has_many` relationships
Song.has_many(
  { type: "section", on: "sections", orderable: true },
  { type: "lyricVersion",  on: "lyricVersions", orderable: true },
  { type: "album", on: "albums" },
)

  /*
Song.customizeStore((set, get) => ({
  incrementSongLyricVersionTally: (song) => {
    set((state) => {
      state.updateSong({
        ...song,
        lyricVersionTally: (song.lyricVersionTally || 0) + 1, // Handle undefined tally gracefully
      });
    });
  },
}));

*/

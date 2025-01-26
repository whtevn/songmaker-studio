import { BaseObject } from "./BaseObject";

import { Album } from "./Album";
import { SongSection } from "./SongSection";
import { LyricVersion } from "./LyricVersion";

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
      lyricVersions: [], // List of { LyricVersionId, Order }
      albums: [], // List of { LyricVersionId, Order }
    };

    Object.assign(this, defaultData, songData);
  }

}

// Define `has_many` relationships
Song.has_many(
  { on: "sections", orderable: true },
  { on: "lyricVersions", orderable: true },
  { on: "albums" },
)


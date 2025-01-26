import { BaseObject } from "./BaseObject";

export class LyricVersion extends BaseObject {
  constructor(lyricVersionData = {}) {
    super(lyricVersionData);

    const defaultData = {
      songId: null, // Required
      lyrics: "",
      name: "Untitled Version",
      timestamp: Date.now(),
    };

    if (!lyricVersionData.songId) {
      throw new Error("LyricVersion must be associated with a song.");
    }

    Object.assign(this, defaultData, lyricVersionData);
  }
}


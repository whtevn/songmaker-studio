import { BaseObject } from "./BaseObject";

export class SongSection extends BaseObject {
  constructor(sectionData = {}, songId) {
    if (!songId) {
      throw new Error("A songId is required to create a SongSection.");
    }

    super(sectionData);

    const defaultData = {
      songId,
      type: "Untitled Section",
      measures: 4,
      lyrics: "",
      color: "gray",
    };

    Object.assign(this, defaultData, sectionData);
  }

  updateSection(data) {
    Object.assign(this, data);
  }
}


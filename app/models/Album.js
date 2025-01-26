import { BaseObject } from "./BaseObject";
import { Song } from '~/models/Song'

export class Album extends BaseObject {
  constructor(albumData = {}) {
    super(albumData);

    const defaultData = {
      title: "Untitled Album",
      status: "writing",
      songs: [], // List of { SongId, Order }
      image: null, // Optional album image
    };

    Object.assign(this, defaultData, albumData);
  }

}

// Define `has_many` relationships
Album.has_many(
  { type: "song", on: "songs", orderable: true },
)



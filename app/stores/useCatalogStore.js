import { create } from "zustand";
import { nanoid } from "nanoid";
import { WRITING } from "~/models/Constants";
import { persist } from 'zustand/middleware'

import { Album } from '~/models/Album'
import { Song } from '~/models/Song'
import { SongSection } from '~/models/SongSection'
import { SongPrompt } from '~/models/SongPrompt'
import { LyricVersion } from '~/models/LyricVersion'

const useStore = create(persist((set, get) => ({
  ...Album.toStore(set, get, { default: [new Album()] }),
  ...Song.toStore(set, get),
  ...SongSection.toStore(set, get),
  ...SongPrompt.toStore(set, get),
  ...LyricVersion.toStore(set, get),
  workingOnSong: null,
  setWorkingOnSong: (localId) => {
    set((state) => ({
      "workingOnSong": localId
    }))
  }
}), { name: "artistCatalogStore" }));

console.log(useStore.getState())

export default useStore;


import { create } from "zustand";
import { nanoid } from "nanoid";
import { WRITING } from "~/models/Constants";
import { persist } from 'zustand/middleware'

import Album from '~/models/Album'
import Song from '~/models/Song'
import SongSection from '~/models/SongSection'
import SongPrompt from '~/models/SongPrompt'
import LyricVersion from '~/models/LyricVersion'
import ChordProgression from '~/models/ChordProgression'

import { mergeStores } from '~/storeMaker'

const useStore = create(persist((set, get) => ({
  ...mergeStores(
    { set, get },
    Song,
    SongPrompt,
    SongSection,
    LyricVersion,
    ChordProgression,
  ),
  ...Album.toStore({get, set}, new Album()),
  workingOnSong: null,
  setWorkingOnSong: (localId) => {
    set((state) => ({
      "workingOnSong": localId
    }))
  },
  saveAllDirtyObjects: async () => {
    const {
      saveDirtyAlbums,
      saveDirtySongs,
      saveDirtySongPrompts,
      saveDirtySongSections,
      saveDirtyLyricVersions,
    } = get()

    try {
      const result = await Promise.all([
        saveDirtyAlbums(),
        saveDirtySongs(),
        saveDirtySongPrompts(),
        saveDirtySongSections(),
        saveDirtyLyricVersions(),
      ])
      set((state) => ({
        dirty: false
      }))
    }catch(e){
      console.error(e)
    }
      /*
    .then(() => 
    )

    .catch((e) => console.log("ERROR", e))
    */
  }
}), {
  name: "artistCatalogStore",
  partialize: (state) => Object.fromEntries(
    Object.entries(state).filter(([key]) => !['workingOnSong'].includes(key)),
  ),
}));

console.log(useStore.getState())

export default useStore;


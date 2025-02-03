import { create } from "zustand";
import { nanoid } from "nanoid";
import { WRITING } from "~/models/Constants";
import { persist } from 'zustand/middleware'

import Album from '~/models/Album'
import Song from '~/models/Song'
import SongSection from '~/models/SongSection'
import SongPrompt from '~/models/SongPrompt'
import LyricVersion from '~/models/LyricVersion'

import { makeStore } from '~/utils/storeMaker'

const useStore = create(persist((set, get) => ({
  ...makeStore(
    { set, get },
    Song,
    SongPrompt,
    SongSection,
    LyricVersion
  ),
  ...Album.toStore({get, set}, new Album()),
  workingOnSong: null,
  setWorkingOnSong: (localId) => {
    set((state) => ({
      "workingOnSong": localId
    }))
  }
}), { name: "artistCatalogStore" }));

console.log(useStore.getState())

export default useStore;


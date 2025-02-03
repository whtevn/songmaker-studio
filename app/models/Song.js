import { defineStore } from '~/storeMaker'
import { supabase, hasMany } from '~/storeMaker/modules'

export default defineStore({
  type: "Song",
  default: {
    title: "Untitled Song",
    status: "writing",
    tempo: 120,
    measures: 0,
    timeSignature: "4/4",
    key: { root: "C", mode: "Ionian" },
    lyrics: "",
    lyricVersionTally: 0,
  },
  has_many: [
    { type: "songSection", on: "songSections", orderable: true },
    { type: "lyricVersion", on: "lyricVersions", orderable: true },
    { type: "album", on: "albums" },
  ],
  backend: {
    toBackend: (song) => ({
      ...song,
    }),
    fromBackend: (song) => ({
      ...song,
    })
  }
})
.withModule(supabase)
.withModule(hasMany)



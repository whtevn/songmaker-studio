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
    key: { root: "C", mode: "ionian" },
    lyrics: "",
    lyricVersionTally: 0,
  },
  has_many: [
    { type: "songSection", on: "songSections", orderable: true },
    { type: "lyricVersion", on: "lyricVersions", orderable: true },
    { type: "chordProgression", on: "chordProgressions", orderable: true },
  ],
  supabase: {
    toDb: (songData) => {
      const {key, lyricVersionTally, songSections, lyricVersions, timeSignature, ...song} = songData;
      return {
        ...song,
        keyroot: song.key?.root,
        keymode: song.key?.mode,
        timesignature: song.timeSignature,
        lyricversiontally: song.lyricVersionTally,
        songsections: song.songSections?.map(s => s.localId) || [],
        lyricversions: song.lyricVersions?.map(s => s.localId) || [],
      }
    },
    fromDb: (song) => {
      return {
        ...song,

        songSections: song.songSections?.map((s,i) => ({localId: s.localId, order: i})) || [],
        lyricVersions: song.lyricVersions?.map((s,i) => ({localId: s.localId, order: i})) || [],
      }
    },
  }
})
.withModule(supabase)
.withModule(hasMany)



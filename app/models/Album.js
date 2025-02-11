import { defineStore } from '~/storeMaker'
import { supabase, hasMany } from '~/storeMaker/modules'
export default defineStore({
  type: "Album",
  default: {
    title: "Untitled Album",
    status: "writing",
    image: null, // Optional album image
  },
  has_many: [
    { type: "song", on: "songs", orderable: true },
  ],
  supabase: {
    toDb: (album) => {
      return {
        ...album,
        songs: album.songs.map(s => s.localId)
      }
    },
    fromDb: (album) => {
      return {
        ...album,
        songs: album.songs.map((s,i) => ({localId: s.localId, order: i})) }
    },
  }
})
.withModule(supabase)
.withModule(hasMany)
    

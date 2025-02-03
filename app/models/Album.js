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
  ]
})
.withModule(supabase)
.withModule(hasMany)

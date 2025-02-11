import { defineStore } from '~/storeMaker'
import { supabase } from '~/storeMaker/modules'
export default defineStore({
  type: "SongSection",
  default: {
    songId: undefined,
    type: "Untitled Section",
    measures: 4,
    chordChart: [],
    lyrics: "",
  },
  required: [ "songId" ]
})
.withModule(supabase)

import { defineStore } from '~/storeMaker'
import { supabase } from '~/storeMaker/modules'
export default defineStore({
  type: "LyricVersion",
  default: {
    songId: null, // Required
    lyrics: "",
    name: "Untitled Version",
    timestamp: ()=>Date.now(),
  }
})
.withModule(supabase)

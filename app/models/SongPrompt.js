import { defineStore } from '~/storeMaker'
import { supabase } from '~/storeMaker/modules'
export default defineStore({
  type: "SongPrompt",
  default: {
    text: "", // Default to empty text
  }
})
.withModule(supabase)

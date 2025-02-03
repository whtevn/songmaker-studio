import { defineStore } from '~/storeMaker'
export default defineStore({
  type: "LyricVersion",
  default: {
    songId: null, // Required
    lyrics: "",
    name: "Untitled Version",
    timestamp: ()=>Date.now(),
  }
})

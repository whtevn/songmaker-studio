import { defineStore } from '~/storeMaker'
export default defineStore({
  type: "SongSection",
  default: {
    songId: undefined,
    type: "Untitled Section",
    measures: 4,
    lyrics: "",
  },
  required: [ "songId" ]
})


import { defineStore } from '~/storeMaker'
import { hasMany } from '~/storeMaker/modules'
export default defineStore({
  type: "ChordProgression",
  default: {
  },
  has_many: [
    { type: "chord", on: "chords", orderable: true },
  ],
})
.withModule(hasMany)

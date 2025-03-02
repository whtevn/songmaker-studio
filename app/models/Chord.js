import { defineStore } from '~/storeMaker'
export default defineStore({
  type: "ChordProgression",
  default: {
    degree: 1,  // Scale degree (e.g., 1 for tonic, 5 for dominant)
    quality: CHORD_QUALITY.MAJOR,  // Chord quality (major, minor, diminished, etc.)
    degreeModification: null,  // Alters root (e.g., bIII)
    extensions: [],  // Extra notes added (without altering structure)
    alterations: [],  // Changes to chord tones (altered dominant, etc.)
  },
})



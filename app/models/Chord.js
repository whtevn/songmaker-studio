import { defineStore } from '~/storeMaker'
export default defineStore({
  type: "Chord",
  default: {
    degree: 1, 
    quality: {},
    degreeModification: null,  
    extensions: [], 
    alterations: [], 
  },
})



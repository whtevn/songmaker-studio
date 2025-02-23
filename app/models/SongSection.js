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
.withModule(()=>(
  {
    store: ({set, get}) => ({
      applyChordToSection: (section, chord)=>{
        const foundSection = section.chordChart 
          ? section 
          : get().songSections.find(s => s.localId === section.localId)

        const filteredChordChart = foundSection.chordChart.filter(c =>
          !(c.lineIndex === chord.lineIndex && c.wordIndex === chord.wordIndex && c.position === chord.position)
        )

        const chordChart = [...filteredChordChart, chord]

        const updatedSection = {...section, chordChart}
        console.log({updatedSection})
        get().updateSongSection(updatedSection)
      }
    })
  }
))
.withModule(supabase)

import scaleFinder from './scales.js'

const {
  notesWithScales,
  chordProgression,
  modes,
  SHARP,
  FLAT,
  WHOLE_STEP,
  HALF_STEP,
  getChordProgression,
  getTriad,
  getScale,
  findScalesContainingNotes,
} = scaleFinder

console.log(findScalesContainingNotes([`D${FLAT}`]))

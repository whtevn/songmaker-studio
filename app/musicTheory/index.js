import {
  notes,
  modes,
  diatonicScale,
  chordProgression,
  NOTES_PER_OCTAVE,
} from './constants'

import {
  chooseEnharmonic,
  findEnharmonicSpelling,
  shiftArray,
  findNoteByLabel,
  constructChord,
  getChordQualityByName,
} from './utility'

export function constructScale(tonic, modeName){
  const normalizedTonic = tonic.toLowerCase()
  const normalizedModeName = modeName.toLowerCase()
  const foundNoteIndex = findNoteByLabel(tonic)
  const foundModeIndex = modes.findIndex(m => m.name.toLowerCase() === normalizedModeName)
  const scaleFormula = shiftArray(foundModeIndex, diatonicScale)
  const chordProgressionInMode = shiftArray(foundModeIndex, chordProgression)
  const { startingKeyIndex, enharmonicSpelling } = findEnharmonicSpelling(tonic)

  const result = scaleFormula.reduce((result, step) => {
    const { noteIndex, scale, index } = result
    const degree = index+1;
    const quality = chordProgressionInMode[index];
    const thisNote = notes[noteIndex]
    const name = index === 0 ? thisNote.enharmonics[0] : chooseEnharmonic(thisNote, enharmonicSpelling[index]);
    const octave = startingKeyIndex + index < 7 ? 4 : 5 // if the scale has progressed past A, raise the octave to 5
    const newNote = { ...thisNote, degree,  quality, name, octave }

    return { noteIndex: ((noteIndex+step) % NOTES_PER_OCTAVE), scale: [...scale, newNote], index: index+1 }
  }, { noteIndex: foundNoteIndex, scale: [], index: 0 })
    .scale
    
  return result.map(note => ({ ...note, chord: constructChord(result, note) }) ) 
}

export function constructSecondaryChord(scale, degree, secondaryDegree) {
  const scaleDegree = scale[degree]
  return constructScale(scaleDegree.name, scaleDegree.quality.name).find(note => note.degree === secondaryDegree);
}

export function constructParallelChord(scale, degree, modeName) {
  return constructScale(scale[0].name, modeName).find(note => note.degree === degree);
}

export function constructBorrowedChord(scale, degree, qualityName) {
  const quality = getChordQualityByName(qualityName)
  const scaleDegree = scale.find(n => n.degree === degree)
  return constructChord(scale, {...scaleDegree, quality})
}

export function constructAllScales() {
  return notes.map((note) => {
    const scales = modes.map((mode) => ({
      mode: mode.name,
      scale: constructScale(note.enharmonics[0], mode.name),
    }));

    return {
      ...note,
      scales,
    };
  });
}



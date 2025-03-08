import {
  notes,
  modes,
  diatonicScale,
  chordProgression,
  NOTES_PER_OCTAVE,
  FLAT,
  SHARP
} from './constants'

import {
  chooseEnharmonic,
  findEnharmonicSpelling,
  degreeToChordName,
  degreeToNumeralNotation,
  degreeToNashvilleNotation,
  shiftArray,
  findNoteIndexByName,
  constructChord,
  getChordQualityByName,
  noteToFrequency,
  compareNotes,
} from './utility'

export function constructScale(tonic, modeName){
  const normalizedTonic = tonic.toLowerCase();
  const normalizedModeName = modeName.toLowerCase();
  const foundNoteIndex = findNoteIndexByName(tonic);
  const foundModeIndex = modes.findIndex(m => m.name.toLowerCase() === normalizedModeName);
  const scaleFormula = shiftArray(foundModeIndex, diatonicScale);
  const chordProgressionInMode = shiftArray(foundModeIndex, chordProgression);
  const { startingKeyIndex, enharmonicSpelling } = findEnharmonicSpelling(tonic);

  const result = scaleFormula.reduce((result, step) => {
    const { noteIndex, scale, index } = result;
    const degree = index + 1;
    const quality = chordProgressionInMode[index];
    const thisNote = notes[noteIndex];
    const name = index === 0 ? thisNote.enharmonics[0] : chooseEnharmonic(thisNote, enharmonicSpelling[index]);
    const octave = startingKeyIndex + index < 7 ? 4 : 5;
    const frequency = noteToFrequency({ name, octave });
    const enharmonics = thisNote.enharmonics
    const romanNumeral = degreeToNumeralNotation({degree}, quality)
    const nashville = degreeToNashvilleNotation({degree}, quality)
    const chordName = degreeToChordName(name, quality)

    const newNote = {
      render: {
        name,
        octave,
        frequency,
        enharmonics,
        romanNumeral,
        chordName,
        nashville,
      },
      quality,
      degree,
    };
    return { noteIndex: ((noteIndex + step) % NOTES_PER_OCTAVE), scale: [...scale, newNote], index: index + 1 };
  }, { noteIndex: foundNoteIndex, scale: [], index: 0 }).scale;

  return {tonic, modeName, notes: result.map(note => ({ ...note, chord: constructChord(result, note) }))};
}

export function constructSecondaryChord(scale, degree, secondaryDegree) {
  const scaleDegree = scale[degree];
  return constructScale(scaleDegree.render.name, scaleDegree.quality.name).notes.find(note => note.degree === secondaryDegree);
}

export function constructParallelChord(scale, degree, modeName) {
  const scaleDegree = scale.find(s => s.degree === degree)
  const chord = constructScale(scale[0].render.name, modeName).notes.find(note => note.degree === degree).chord


  let degreeModifier = '';
  const compared = compareNotes(scaleDegree, chord.notes[0])
  if(compared === -1) degreeModifier = FLAT
  if(compared === 1) degreeModifier = SHARP
  return {
    ...chord, degreeModifier
  }
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

export const playChord = (notes, audioContext, startTime, adsr = { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 }) => {
  notes.forEach(({ frequency, velocity }) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    const { attack, decay, sustain, release } = adsr;
    const noteLength = attack + decay + release; // Total duration of the note

    const maxGain = velocity * 0.2; // Scale velocity (0-1) to a max gain range
    const sustainLevel = sustain * maxGain; // Scale sustain relative to velocity

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // Apply ADSR envelope with velocity
    gainNode.gain.setValueAtTime(0.0, startTime); // Start silent
    gainNode.gain.linearRampToValueAtTime(maxGain, startTime + attack); // Attack phase (rises)
    gainNode.gain.linearRampToValueAtTime(sustainLevel, startTime + attack + decay); // Decay to sustain level
    gainNode.gain.setValueAtTime(sustainLevel, startTime + noteLength - release); // Hold sustain
    gainNode.gain.linearRampToValueAtTime(0.001, startTime + noteLength); // Release phase (fade out)

    oscillator.connect(gainNode).connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + noteLength);
  });
};




export { SHARP, FLAT }

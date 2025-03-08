/* UTILITY FUNCTION */
import {
  notes,
  romanNumerals,
  DIMINISHED,
  ENHARMONIC_SPELLING,
  CHORD_QUALITY,
  SHARP,
  FLAT,
  NOTES_PER_OCTAVE,
  A4_FREQUENCY,
} from './constants'

export function chooseEnharmonic(noteObj, targetLetter) {
  return noteObj.enharmonics.find(e => e.startsWith(targetLetter)) || noteObj.enharmonics[0];
}

export function findEnharmonicSpelling(tonic){
  const startingKeyIndex = ENHARMONIC_SPELLING.findIndex(key => key === tonic.substring(0, 1))
  const enharmonicSpelling = shiftArray(startingKeyIndex, ENHARMONIC_SPELLING)
  return { startingKeyIndex, enharmonicSpelling }
}

export function shiftArray(startIndex, array) {
  const shiftAmount = startIndex % array.length;
  return array.slice(shiftAmount).concat(array.slice(0, shiftAmount));
}

export function findNoteIndexByName(label) {
  const normalizedLabel = label.toLowerCase();
  return notes.findIndex((note) =>
    note.enharmonics.some((l) => l.toLowerCase() === normalizedLabel)
  );
}

export function constructChord(scale, chordDefinition) {
  console.log(chordDefinition.degree)
  console.log(chordDefinition)
  const baseOctave = chordDefinition.render.octave; // Ensure the root stays in its given octave
  const NOTES_PER_OCTAVE = 12;

  const rootNoteIndex = notes.findIndex(note =>
    note.enharmonics.includes(chordDefinition.render.name)
  );

  if (rootNoteIndex === -1) {
    console.error("Root note not found:", chordDefinition.render.name);
    return null;
  }


  const render = {
    degree: chordDefinition.degree,
    notes: chordDefinition.quality.steps.map((steps, index) => {
      let noteIndex = (rootNoteIndex + steps) % notes.length;
      let note = notes[noteIndex];

      // Root note should always stay in its original octave
      let octave = baseOctave;

      // Increase octave **only** for notes above the root
      if (index > 0 && noteIndex < rootNoteIndex) {
        octave += 1;
      }

      console.log({ note, octave, rootNoteIndex, steps });

      // Find best enharmonic spelling within the scale
      const matchingScaleNote = scale.find(scaleNote =>
        note.enharmonics.includes(scaleNote.render.name)
      );

      const name = matchingScaleNote
        ? matchingScaleNote.render.name
        : accidentalConsistency(scale, note.enharmonics);

      const frequency = noteToFrequency({ name, octave });

      return {
        render: {
          name,
          octave,
          frequency,
          enharmonics: note.enharmonics,
        },
      };
    }),
  };

  return render;
}





export function accidentalConsistency(scale, enharmonics) {
  const naturalNote = enharmonics.find(note => note.length === 1);
  if (naturalNote) return naturalNote;
  const accidentalsInScale = scale.flatMap(note => note.render.name.match(new RegExp(`[${FLAT}${SHARP}]`, 'g')) || []);
  if (accidentalsInScale.length > 0) {
    const preferredAccidental = accidentalsInScale[0];
    return enharmonics.find(note => note.includes(preferredAccidental)) || enharmonics[0];
  }
  return enharmonics[0];
}

export function getChordQualityByName(qualityName){
  const quality = Object.values(CHORD_QUALITY).find(cq => cq.name === qualityName);
  if (!quality) throw new Error(`Invalid chord quality: ${qualityName}`);
  return quality;
}

export function noteToFrequency(note){
  const { octave, name } = note;
  const a4Index = notes.findIndex((note) => note.enharmonics.includes("A"));
  const semitoneIndex = findNoteIndexByName(name);
  const semitonesFromA4 = semitoneIndex - a4Index + (octave - 4) * NOTES_PER_OCTAVE;
  return A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12);
}

export function compareNotes(note1, note2) {
  const index1 = findNoteIndexByName(note1.render.name)
  const index2 = findNoteIndexByName(note2.render.name)

  if (index1 === -1 || index2 === -1) return 0; // Safety fallback

  // Handle wrap-around cases where last note moves to first (e.g., B → C)
  if (index1 === notes.length - 1 && index2 === 0) return 1; // B → C should be +1
  if (index1 === 0 && index2 === notes.length - 1) return -1; // C → B should be -1

  return Math.sign(index2 - index1); // -1 for flat, 1 for sharp, 0 for same note
}

export function degreeToChordName(name, quality){
  switch(quality.name) {
    case "major":
      return `${name}`
    case "minor":
      return  `${name}m`
    case "diminished":
      return `${name}dim`
  }
}

export function degreeToNumeralNotation({degree, degreeModifier}, quality){
  const name = romanNumerals[degree-1]
  switch(quality.name) {
    case "major":
      return name.toUpperCase()
    case "minor":
      return name.toLowerCase()
    case "diminished":
      return `${name.toLowerCase()}${DIMINISHED}`
  }
}

export function degreeToNashvilleNotation({degree, degreeModifier}, quality){
  switch(quality.name) {
    case "major":
      return `${degree}`
    case "minor":
      return  `${degree}m`
    case "diminished":
      return `${degree}dim`
  }
}

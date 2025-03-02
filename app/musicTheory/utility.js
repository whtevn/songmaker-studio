/* UTILITY FUNCTION */
import {
  notes,
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
  const rootNoteIndex = notes.findIndex(note => note.enharmonics === chordDefinition.render.enharmonics);
  const baseOctave = chordDefinition.render.octave;
  const { startingKeyIndex, enharmonicSpelling } = findEnharmonicSpelling(scale[0].render.name);
  const scaleNote = scale.find(note => note.degree === chordDefinition.degree)

  const result = {
    degree: chordDefinition.degree,
    notes: chordDefinition.quality.steps.map(steps => {
      const note = notes[(rootNoteIndex + steps) % notes.length]; // Ensure within bounds
      const octave = startingKeyIndex + chordDefinition.degree - 1 + steps < enharmonicSpelling.length ? baseOctave : baseOctave + 1;
      const matchingScaleNote = scale.find(scaleNote =>
        note.enharmonics.some(enh => scaleNote.render.name === enh)
      );
      const name = matchingScaleNote ? matchingScaleNote.render.name : accidentalConsistency(scale, note.enharmonics);
      const frequency = noteToFrequency({ name, octave });

      return {
        render: {
          name,
          octave,
          frequency,
          enharmonics: note.enharmonics
        },
        quality: chordDefinition.quality,
        degree: chordDefinition.degree,
      };
    })
  }

  let degreeModifier;

  switch(compareNotes(scaleNote, result.notes[0])){
    case -1: 
      degreeModifier = FLAT
    case 1: 
      degreeModifier = SHARP
  }

  return { ...result, degreeModifier }
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
  console.log({index1, index2})

  if (index1 === -1 || index2 === -1) return 0; // Safety fallback

  // Handle wrap-around cases where last note moves to first (e.g., B → C)
  if (index1 === notes.length - 1 && index2 === 0) return 1; // B → C should be +1
  if (index1 === 0 && index2 === notes.length - 1) return -1; // C → B should be -1

  return Math.sign(index2 - index1); // -1 for flat, 1 for sharp, 0 for same note
}

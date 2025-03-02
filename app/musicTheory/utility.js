import {
  notes,
  ENHARMONIC_SPELLING,
  CHORD_QUALITY,
  SHARP,
  FLAT,
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

export function findNoteByLabel(label) {
  const normalizedLabel = label.toLowerCase();
  return notes.findIndex((note) =>
    note.enharmonics.some((l) => l.toLowerCase() === normalizedLabel)
  );
}

export function constructChord(scale, chordDefinition) {
  const rootNoteIndex = notes.findIndex(note => note.enharmonics === chordDefinition.enharmonics);
  const baseOctave = chordDefinition.octave
  const { startingKeyIndex, enharmonicSpelling } = findEnharmonicSpelling(scale[0].name)

  return chordDefinition.quality.steps.map(steps => {
    const note = notes[(rootNoteIndex + steps) % notes.length]; // Ensure within bounds
    const octave = startingKeyIndex + steps < 7 ? baseOctave : baseOctave+1 

    // Find if this note exists in the scale and use that enharmonic spelling
    const matchingScaleNote = scale.find(scaleNote =>
      note.enharmonics.some(enh => scaleNote.name === enh)
    );

    const name = matchingScaleNote ? matchingScaleNote.name : accidentalConsistency(scale, note.enharmonics);

    return { ...note, name, octave };
  });
}

export function accidentalConsistency(scale, enharmonics) {
  // If one member of `enharmonics` is a natural note, default to that
  const naturalNote = enharmonics.find(note => note.length === 1);
  if (naturalNote) return naturalNote;

  // If both members have accidentals, find the first accidental in the scale
  const accidentalsInScale = scale.flatMap(note => note.name.match(new RegExp(`[${FLAT}${SHARP}]`, 'g')) || []);
  if (accidentalsInScale.length > 0) {
    const preferredAccidental = accidentalsInScale[0];
    return enharmonics.find(note => note.includes(preferredAccidental)) || enharmonics[0];
  }

  // If the scale has no accidentals, choose the first enharmonic
  return enharmonics[0];
}

export function getChordQualityByName(qualityName){
  const quality = Object.values(CHORD_QUALITY).find(cq => cq.name === qualityName);
  if (!quality) throw new Error(`Invalid chord quality: ${qualityName}`);
  return quality
}



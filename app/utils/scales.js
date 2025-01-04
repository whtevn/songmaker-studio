const SHARP = "♯";
const FLAT = "♭";
const WHOLE_STEP = 2;
const HALF_STEP = 1;
const A4_FREQUENCY = 440; // Standard pitch for A4
const NOTES_PER_OCTAVE = 12;

const notes = [
  { labels: ["C", `B${SHARP}`], natural: true },
  { labels: [`D${FLAT}`, `C${SHARP}`], natural: false },
  { labels: ["D"], natural: true },
  { labels: [`E${FLAT}`, `D${SHARP}`], natural: false },
  { labels: ["E", `F${FLAT}`], natural: true },
  { labels: ["F", `E${SHARP}`], natural: true },
  { labels: [`G${FLAT}`, `F${SHARP}`], natural: false },
  { labels: ["G"], natural: true },
  { labels: [`A${FLAT}`, `G${SHARP}`], natural: false },
  { labels: ["A"], natural: true },
  { labels: [`B${FLAT}`, `A${SHARP}`], natural: false },
  { labels: ["B", `C${FLAT}`], natural: true },
];

const modes = [
  { label: "ionian", description: "Major scale" },
  { label: "dorian", description: "Minor scale with a raised 6th" },
  { label: "phrygian", description: "Minor scale with a lowered 2nd" },
  { label: "lydian", description: "Major scale with a raised 4th" },
  { label: "mixolydian", description: "Major scale with a lowered 7th" },
  { label: "aeolian", description: "Natural minor scale" },
  { label: "locrian", description: "Minor scale with a lowered 2nd and 5th" },
];

const chordProgression = [
  { mode: "ionian", type: "major", shortName: "maj" },
  { mode: "aeolian", type: "minor", shortName: "min" },
  { mode: "aeolian", type: "minor", shortName: "min" },
  { mode: "ionian", type: "major", shortName: "maj" },
  { mode: "ionian", type: "major", shortName: "maj" },
  { mode: "aeolian", type: "minor", shortName: "min" },
  { mode: "locrian", type: "diminished", shortName: "dim" },
];

const intervals = {
  root: 0,
  major2nd: WHOLE_STEP,
  major3rd: WHOLE_STEP * 2,
  perfect4th: WHOLE_STEP * 2 + HALF_STEP,
  perfect5th: WHOLE_STEP * 3 + HALF_STEP,
  minor3rd: WHOLE_STEP + HALF_STEP,
  diminished5th: WHOLE_STEP * 3,
  diminished7th: WHOLE_STEP * 4 + HALF_STEP,
};

const chordFormulas = {
  major: [intervals.root, intervals.major3rd, intervals.perfect5th],
  minor: [intervals.root, intervals.minor3rd, intervals.perfect5th],
  diminished: [intervals.root, intervals.minor3rd, intervals.diminished5th],
  sus2: [intervals.root, intervals.major2nd, intervals.perfect5th],
  sus4: [intervals.root, intervals.perfect4th, intervals.perfect5th],
};

const chordExtensions = [
  { id: "6", semitones: 10, label: "Major 6th" },
  { id: "m7", semitones: 11, label: "Minor 7th" },
  { id: "M7", semitones: 12, label: "Major 7th" },
  { id: "9", semitones: 15, label: "Major 9th" },
];

const ionianFormula = [WHOLE_STEP, WHOLE_STEP, HALF_STEP, WHOLE_STEP, WHOLE_STEP, WHOLE_STEP, HALF_STEP];

function findNoteByLabel(label) {
  const normalizedLabel = label.toLowerCase();
  return notes.findIndex((note) =>
    note.labels.some((l) => l.toLowerCase() === normalizedLabel)
  );
}

function shiftArray(startIndex, array) {
  const shiftAmount = startIndex % array.length;
  return array.slice(shiftAmount).concat(array.slice(0, shiftAmount));
}

function generateScale(startLabel, modeLabel) {
  const startIndex = findNoteByLabel(startLabel);
  if (startIndex === -1) throw new Error(`Note '${startLabel}' not found.`);

  const modeIndex = modes.findIndex((mode) => mode.label === modeLabel);
  if (modeIndex === -1) throw new Error(`Mode '${modeLabel}' not found.`);

  const modeFormula = shiftArray(modeIndex, ionianFormula);

  let scale = [];
  let currentIndex = startIndex;

  modeFormula.forEach((step) => {
    const note = notes[currentIndex];
    scale.push(note.labels);
    currentIndex = (currentIndex + step) % notes.length;
  });

  return scale;
}

function isValidScale(scale) {
  const usedLetters = new Set();
  for (const note of scale) {
    const letter = note[0].toUpperCase();
    if (usedLetters.has(letter)) return false;
    usedLetters.add(letter);
  }
  return true;
}

export function generateAllScales() {
  return notes.map((note) => {
    const scales = modes.map((mode) => ({
      mode: mode.label,
      scale: generateScale(note.labels[0], mode.label),
    }));

    return {
      ...note,
      scales,
    };
  });
}

// Normalize the given notes for case-insensitivity and potential arrays
function normalizeNotes(notes) {
  return notes.map((note) =>
    Array.isArray(note) ? note.map((n) => n.toLowerCase()) : note.toLowerCase()
  );
}

// Check if all given notes match some label in the scale
function notesMatchScale(givenNotes, scaleNotes) {
  return givenNotes.every((givenNote) => {
    if (Array.isArray(givenNote)) {
      return givenNote.some((noteOption) =>
        scaleNotes.some((scaleNote) => scaleNote.includes(noteOption))
      );
    }
    return scaleNotes.some((scaleNote) => scaleNote.includes(givenNote));
  });
}

// Map a given note to its degree, chord, and name
function mapNoteToDegree(note, scaleNotes, scaleObj, chordProgression, notesWithScales) {
  let matchedNote;
  if (Array.isArray(note)) {
    matchedNote = note.find((noteOption) =>
      scaleNotes.some((scaleNote) => scaleNote.includes(noteOption))
    );
  } else {
    matchedNote = note;
  }

  const modeIndex = modes.findIndex((mode) => mode.label === scaleObj.mode);
  if (modeIndex === -1) throw new Error(`Mode '${scaleObj.mode}' not found.`);
  const shiftedProgression = shiftArray(modeIndex, chordProgression);

  const degreeIndex = scaleNotes.findIndex((scaleNote) => scaleNote.includes(matchedNote));

  const chordRoot = scaleObj.scale[degreeIndex][0];
  const progressionData = shiftedProgression[degreeIndex % chordProgression.length];
  const chord = getTriad(chordRoot, progressionData.mode, notesWithScales);

  const degree = degreeIndex + 1;
  return {
    note: matchedNote,
    degree,
    chord,
    name: `${chordRoot} ${progressionData.shortName} (${degree})`, // E.g., "C maj" or "G min"
  };
}

// Main function to find scales containing notes
export function findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options = {}) {
  const normalizedNotes = normalizeNotes(givenNotes);
  const { modes: allowedModes } = options;

  const matchingScales = [];

  notesWithScales.forEach((note) => {
    note.scales.forEach((scaleObj) => {
      if (allowedModes && !allowedModes.includes(scaleObj.mode)) return;

      const scaleNotes = scaleObj.scale.map((noteLabels) =>
        noteLabels.map((label) => label.toLowerCase())
      );

      if (notesMatchScale(normalizedNotes, scaleNotes)) {
        let degrees = normalizedNotes.map((givenNote) =>
          mapNoteToDegree(givenNote, scaleNotes, scaleObj, chordProgression, notesWithScales)
        );

        // Sort degrees to match the scale order
        degrees = degrees.sort((a, b) => a.degree - b.degree);
        const scale = {
          name: `${note.labels[0]} ${scaleObj.mode}`,
          root: note.labels[0],
          mode: scaleObj.mode,
          scale: scaleObj.scale,
          degrees,
        }
        const rendered = renderScale(scaleObj.scale)
        const allNotes = allUsedNotes({...scale, rendered})

        matchingScales.push({
          ...scale,
          rendered,
          allNotes,
        });
      }
    });
  });

  return matchingScales;
}




function getTriad(root, modeLabel, notesWithScales) {
  const rootNote = notesWithScales.find((note) =>
    note.labels.some((label) => label.toLowerCase() === root.toLowerCase())
  );

  if (!rootNote) throw new Error(`Root note '${root}' not found.`);

  const scaleObj = rootNote.scales.find((scale) => scale.mode === modeLabel);
  if (!scaleObj) throw new Error(`Mode '${modeLabel}' not found for root '${root}'.`);

  const renderedScale = renderScale(scaleObj.scale);

  return [renderedScale[0], renderedScale[2], renderedScale[4]];
}

function renderScale(scale) {
  const renderedScale = [];
  const baseOrder = "ABCDEFG";

  // Dynamically shift the order based on the first note in the scale
  let root = scale[0][0][0].toUpperCase(); // Get the root note's base letter
  let rootIndex = baseOrder.indexOf(root);
  const order = baseOrder.slice(rootIndex) + baseOrder.slice(0, rootIndex); // Shifted order

  // Attempt history for backtracking
  const attempts = new Array(scale.length).fill(0);

  let index = 0;
  while (index < scale.length) {
    const noteOptions = Array.isArray(scale[index]) ? scale[index] : [scale[index]];
    const attemptIndex = attempts[index];

    // If we've exhausted all options for this note, backtrack
    if (attemptIndex >= noteOptions.length) {
      if (index === 0) {
        throw new Error("Unable to render scale: all options exhausted for the first note");
      }

      // Backtrack to the previous note
      attempts[index] = 0; // Reset current note's attempts
      renderedScale.pop(); // Remove last rendered note
      index -= 1; // Move back to the previous note
      attempts[index] += 1; // Try the next option for the previous note
      continue;
    }

    // Find the expected letter for this position
    const lastRenderedLetter = renderedScale.length > 0
      ? renderedScale[renderedScale.length - 1][0].toUpperCase()
      : null;
    const nextLetter = lastRenderedLetter
      ? order[(order.indexOf(lastRenderedLetter) + 1) % order.length]
      : null;

    // Choose the current option and check if it matches the next letter
    const selectedNote = noteOptions[attemptIndex];
    const selectedLetter = selectedNote[0].toUpperCase();

    if (!lastRenderedLetter || selectedLetter === nextLetter) {
      // Valid note, add it to the rendered scale
      renderedScale.push(selectedNote);
      index += 1; // Move to the next note
    } else {
      // Invalid note, try the next option
      attempts[index] += 1;
    }
  }

  return renderedScale;
}

/**
 * Calculate the frequency of a note using the `notes` array.
 * @param {string} noteWithOctave - The note in the format "C#/4" or "D/5".
 * @param {Array} notes - The array defining note labels and their order.
 * @returns {number} The calculated frequency in Hz.
 */
export const calculateFrequency = (noteWithOctave, notes) => {
  const [rawNoteLabel, octaveStr] = noteWithOctave.split("/");
  const noteLabel = rawNoteLabel.replace("#", SHARP).replace("b", FLAT);
  const octave = parseInt(octaveStr, 10);

  if (isNaN(octave)) {
    throw new Error(`Invalid octave in note: ${noteWithOctave}`);
  }

  // Find the index of the note in the `notes` array
  let semitoneIndex = -1;
  notes.forEach((note, index) => {
    if (note.labels.includes(noteLabel)) {
      semitoneIndex = index;
    }
  });

  if (semitoneIndex === -1) {
    throw new Error(`Invalid note label: ${noteLabel}`);
  }

  // Calculate the distance from A4
  const a4Index = notes.findIndex((note) => note.labels.includes("A"));
  const semitonesFromA4 =
    semitoneIndex - a4Index + (octave - 4) * NOTES_PER_OCTAVE;

  // Calculate frequency using the formula
  return A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12);
};


function allUsedNotes(scale) {
  // Flatten the renderedScale
  const scaleNotes = scale.rendered.flat();

  // Flatten all notes in degree.chord arrays
  const degreeChordNotes = scale.degrees
    .flatMap((degree) => degree.chord.flat());

  // Combine and deduplicate notes
  const allNotes = Array.from(new Set([...scaleNotes, ...degreeChordNotes]));

  return allNotes;
}

function scaleToNotation(scale) {
  const staveNotes = [];
  let currentOctave = 4;
  let previousNote = null;

  const fullScale = [...scale.rendered, scale.rendered[0]]
  fullScale.forEach((note, index) => {
    const baseNote = note[0].toUpperCase();

    // Adjust the octave of the base note using `nextInstanceOfNote`
    const baseNoteWithOctave = previousNote
      ? nextInstanceOfNote(`${previousNote}/${currentOctave}`, baseNote)
      : `${baseNote}/${currentOctave}`;

    const [_, octave] = baseNoteWithOctave.split("/");
    currentOctave = parseInt(octave, 10);
    previousNote = baseNote;

    // Find the degree and corresponding chord
    const degree = scale.degrees.find((deg) => deg.degree === index%7 + 1);

    if (degree) {
      // Process chord notes
      const chordNotes = degree.chord.flat().reduce((notes, chordNote) => {
        const previousChordNote = notes.length > 0 ? notes[notes.length - 1] : baseNoteWithOctave;
        const nextChordNote = nextInstanceOfNote(previousChordNote, chordNote.replace(FLAT, "b").replace(SHARP, "#"));
        return [...notes, nextChordNote];
      }, []);

      staveNotes.push({
        keys: chordNotes,
        duration: "q",
        label: `${note} ${degree.name.split(" ")[1]}`,
      });
    } else {
      // Process single note
      const singleNote = nextInstanceOfNote(baseNoteWithOctave, note.replace(FLAT, "b").replace(SHARP, "#"));
      staveNotes.push({
        keys: [singleNote],
        duration: "q",
        label: note,
      });
    }
  });

  return staveNotes;
}


function nextInstanceOfNote(baseNoteWithOctave, noteWithoutOctave) {
  const baseOrder = "CDEFGAB";

  // Extract base note and octave from the first argument
  const [baseNote, baseOctave] = baseNoteWithOctave.split("/");
  const baseNoteIndex = baseOrder.indexOf(baseNote[0]);

  // Extract the base note of the second argument
  const targetNoteIndex = baseOrder.indexOf(noteWithoutOctave[0]);

  // Determine the octave of the target note
  let targetOctave = parseInt(baseOctave, 10);

  if (targetNoteIndex < baseNoteIndex) {
    targetOctave++; // Increment octave if target note comes before base note in the scale
  }

  return `${noteWithoutOctave}/${targetOctave}`;
}

function identifyChord(notes, chordFormulas, chordExtensions, chordNotes) {
  // Helper to find the index of a note in the chromatic scale
  const findNoteIndex = (note) => {
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].labels.includes(note)) {
        return i;
      }
    }
    throw new Error(`Note ${note} not found in notes array.`);
  };

  // Normalize the input notes to their indices
  const normalizedIndices = chordNotes.map(findNoteIndex);

  // Sort indices in ascending order for comparison
  const sortedIndices = normalizedIndices.sort((a, b) => a - b);

  // Calculate intervals (semitone differences) from the root
  const calculateIntervals = (indices) => {
    const root = indices[0];
    return indices.map((note) => (note - root + 12) % 12);
  };

  // Cycle through all possible inversions
  for (let i = 0; i < sortedIndices.length; i++) {
    const rotatedIndices = [
      ...sortedIndices.slice(i),
      ...sortedIndices.slice(0, i).map((note) => note + 12), // Wrap around
    ].sort((a, b) => a - b);

    const intervals = calculateIntervals(rotatedIndices);

    // Check against chord formulas
    for (const [chordType, formula] of Object.entries(chordFormulas)) {
      if (formula.every((interval) => intervals.includes(interval))) {
        // Find matched chordExtensions
        const matchedExtensions = chordExtensions
          .filter(({ semitones }) => intervals.includes(semitones))
          .map(({ id, label }) => ({ extension: id, label }));

        // Return the identified chord with the rotated root
        return {
          root: notes[rotatedIndices[0] % 12].labels[0], // Get root note label
          type: chordType,
          chordExtensions: matchedExtensions,
          intervals,
        };
      }
    }
  }

  // If no match is found
  return {
    type: "unknown",
    chordExtensions: [],
    intervals: calculateIntervals(sortedIndices),
  };
}



function generateChord(notes, chordFormulas, chordExtensions, root, options = { extend: [], type: "major" }) {
  const { extend, type } = options;

  // Find the index of the root note in the notes array
  const rootIndex = notes.findIndex((note) =>
    note.labels.some((label) => label.toLowerCase() === root.toLowerCase())
  );

  if (rootIndex === -1) {
    throw new Error(`Root note '${root}' not found in the notes array.`);
  }

  // Get the base chord formula based on the chord type
  const baseFormula = chordFormulas[type]?.map((degree) => degree - 1); // Convert to 0-based indexing
  if (!baseFormula) {
    throw new Error(`Invalid chord type '${type}'. Valid types are: ${Object.keys(chordFormulas).join(", ")}`);
  }

  // Calculate the full chord formula (including chordExtensions)
  const fullFormula = [
    ...baseFormula,
    ...extend
      .map((ext) => {
        const extension = chordExtensions.find(({ id }) => id === ext);
        return extension ? extension.semitones : undefined;
      })
      .filter((val) => val !== undefined),
  ];


  // Resolve the notes for the chord
  const chordNotes = fullFormula.map((interval) => {
    const noteIndex = (rootIndex + interval) % notes.length; // Wrap around the chromatic scale
    return notes[noteIndex].labels[0]; // Use the first label by default
  });

  return chordNotes;
}

export const notesWithScales = generateAllScales();

const backendLibrary = {
  notes,
  notesWithScales,
  chordProgression,
  modes,
  FLAT,
  SHARP,
  HALF_STEP,
  WHOLE_STEP,
  renderScale,
  allUsedNotes,
  scaleToNotation,
  chordExtensions,
  intervals,
  chordFormulas,
  generateScale,
  identifyChord: (chordnNotes) =>
    identifyChord(notes, chordFormulas, chordExtensions, chordNotes),
  generateChord: (root, options = { extend: [], type: "major" }) =>
    generateChord(notes, chordFormulas, chordExtensions, root, options = { extend: [], type: "major" }),
  calculateFrequency: (noteWithOctave) =>
    calculateFrequency(noteWithOctave, notes),
  getChordProgression: (root, modeLabel) =>
    getChordProgression(root, modeLabel, notesWithScales, chordProgression),
  getTriad: (root, modeLabel) => getTriad(root, modeLabel, notesWithScales),
  getScale: (root, modeLabel) => getScale(root, modeLabel, notesWithScales),
  findScalesContainingNotes: (givenNotes, options = {}) =>
    findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options),
};

export default backendLibrary;


// Constants
const SHARP = '♯';
const FLAT = '♭';
const WHOLE_STEP = 2;
const HALF_STEP = 1;

// Notes with labels
const notes = [
  { labels: ['C', `B${SHARP}`], natural: true },
  { labels: [`D${FLAT}`, `C${SHARP}`], natural: false },
  { labels: ['D'], natural: true },
  { labels: [`E${FLAT}`, `D${SHARP}`], natural: false },
  { labels: ['E', `F${FLAT}`], natural: true },
  { labels: ['F', `E${SHARP}`], natural: true },
  { labels: [`G${FLAT}`, `F${SHARP}`], natural: false },
  { labels: ['G'], natural: true },
  { labels: [`A${FLAT}`, `G${SHARP}`], natural: false },
  { labels: ['A'], natural: true },
  { labels: [`B${FLAT}`, `A${SHARP}`], natural: false },
  { labels: ['B', `C${FLAT}`], natural: true },
];

// Modes with descriptions
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
  "ionian",
  "aeolian",
  "aeolian",
  "ionian",
  "ionian",
  "aeolian",
  "locrian"
]

// Ionian formula
const ionianFormula = [
  WHOLE_STEP,
  WHOLE_STEP,
  HALF_STEP,
  WHOLE_STEP,
  WHOLE_STEP,
  WHOLE_STEP,
  HALF_STEP,
];

// Utility Functions
function findNoteByLabel(label) {
  const normalizedLabel = label.toLowerCase();
  return notes.findIndex(note =>
    note.labels.some(l => l.toLowerCase() === normalizedLabel)
  );
}

function shiftArray(startIndex, array) {
  const shiftAmount = startIndex % array.length;
  return array.slice(shiftAmount).concat(array.slice(0, shiftAmount));
}

function generateScale(startLabel, modeLabel) {
  // Find the starting note
  const startIndex = findNoteByLabel(startLabel);
  if (startIndex === -1) {
    throw new Error(`Note '${startLabel}' not found.`);
  }

  // Find the mode by its label
  const modeIndex = modes.findIndex((mode) => mode.label === modeLabel);
  if (modeIndex === -1) {
    throw new Error(`Mode '${modeLabel}' not found.`);
  }

  // Shift the Ionian formula by the mode index
  const modeFormula = shiftArray(modeIndex, ionianFormula);

  // Generate the scale using the mode formula
  let scale = [];
  let currentIndex = startIndex;

  modeFormula.forEach((step) => {
    const note = notes[currentIndex];
    scale.push(note.labels); // Push all labels for the note (e.g., ["C♯", "D♭"])
    currentIndex = (currentIndex + step) % notes.length; // Wrap around the chromatic scale
  });

  return scale;
}



// Helper function to check if a scale is valid
function isValidScale(scale) {
  const usedLetters = new Set();
  for (const note of scale) {
    const letter = note[0].toUpperCase(); // Get the letter name (e.g., "A" from "A♭")
    if (usedLetters.has(letter)) {
      return false; // Duplicate letter found
    }
    usedLetters.add(letter);
  }
  return true; // All letters are unique
}


export function generateAllScales() {
  return notes.map(note => {
    const scales = modes.map(mode => ({
      mode: mode.label,
      scale: generateScale(note.labels[0], mode.label),
    }));

    return {
      ...note,
      scales,
    };
  });
}

export function findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options = {}) {
  // Normalize the given notes for case-insensitivity and potential arrays
  const normalizedNotes = givenNotes.map((note) =>
    Array.isArray(note)
      ? note.map((n) => n.toLowerCase())
      : note.toLowerCase()
  );

  // Extract options
  const { modes: allowedModes } = options;

  // Filter scales that contain all the given notes
  const matchingScales = [];

  notesWithScales.forEach((note) => {
    note.scales.forEach((scaleObj) => {
      // Skip modes not in the allowedModes array (if specified)
      if (allowedModes && !allowedModes.includes(scaleObj.mode)) {
        return;
      }

      // Normalize scale notes (each is now an array of possible labels)
      const scaleNotes = scaleObj.scale.map((noteLabels) =>
        noteLabels.map((label) => label.toLowerCase())
      );

      // Check if all given notes match some label in the scale
      const allNotesMatch = normalizedNotes.every((givenNote) => {
        if (Array.isArray(givenNote)) {
          // For arrays, check if at least one option matches
          return givenNote.some((noteOption) =>
            scaleNotes.some((scaleNote) => scaleNote.includes(noteOption))
          );
        }
        // For single notes, check directly
        return scaleNotes.some((scaleNote) => scaleNote.includes(givenNote));
      });

      if (allNotesMatch) {
        // Map the requested notes to their degrees in the scale
        const degrees = normalizedNotes.map((givenNote) => {
          let matchedNote;
          if (Array.isArray(givenNote)) {
            // Find the first matching note in the scale for arrays
            matchedNote = givenNote.find((noteOption) =>
              scaleNotes.some((scaleNote) => scaleNote.includes(noteOption))
            );
          } else {
            matchedNote = givenNote;
          }

          const degreeIndex = scaleNotes.findIndex((scaleNote) => scaleNote.includes(matchedNote));

          // Determine the corresponding chord using the chord progression
          const chordRoot = scaleObj.scale[degreeIndex][0]; // Use the first label as the chord root
          const chordMode = chordProgression[degreeIndex % chordProgression.length];
          const chord = getTriad(chordRoot, chordMode, notesWithScales);

          return {
            note: matchedNote,
            degree: degreeIndex + 1, // Degrees are 1-based
            chord,
          };
        });

        matchingScales.push({
          root: note.labels[0],
          mode: scaleObj.mode,
          scale: scaleObj.scale,
          degrees,
        });
      }
    });
  });

  return matchingScales;
}




// Example usage
/*
console.log(getScale("A", "aeolian", notesWithScales));
console.log(getScale("A", "locrian", notesWithScales));
*/
function getScale(root, modeLabel, notesWithScales) {
  // Find the root note object in notesWithScales
  const rootNote = notesWithScales.find(note =>
    note.labels.some(label => label.toLowerCase() === root.toLowerCase())
  );

  if (!rootNote) {
    throw new Error(`Root note '${root}' not found.`);
  }

  // Find the scale object for the given mode
  const scaleObj = rootNote.scales.find(scale => scale.mode === modeLabel);

  if (!scaleObj) {
    throw new Error(`Mode '${modeLabel}' not found for root '${root}'.`);
  }

  return scaleObj.scale;
}

function getTriad(root, modeLabel, notesWithScales) {
  // Ensure notesWithScales is defined and valid
  if (!Array.isArray(notesWithScales) || notesWithScales.length === 0) {
    throw new Error("Invalid or empty 'notesWithScales' provided.");
  }

  // Find the root note object in notesWithScales
  const rootNote = notesWithScales.find((note) =>
    note.labels.some((label) => label.toLowerCase() === root.toLowerCase())
  );

  if (!rootNote) {
    throw new Error(`Root note '${root}' not found.`);
  }

  // Find the scale object for the given mode
  const scaleObj = rootNote.scales.find((scale) => scale.mode === modeLabel);

  if (!scaleObj) {
    throw new Error(`Mode '${modeLabel}' not found for root '${root}'.`);
  }

  // Render the scale using renderScale
  const renderedScale = renderScale(scaleObj.scale);

  // Get the triad notes: 1st, 3rd, and 5th degrees
  const triad = [renderedScale[0], renderedScale[2], renderedScale[4]];

  return triad;
}


function getChordProgression(root, modeLabel, chordProgression, notesWithScales) {
  // Ensure notesWithScales is valid
  if (!Array.isArray(notesWithScales) || notesWithScales.length === 0) {
    throw new Error("Invalid or empty 'notesWithScales' provided.");
  }

  // Get the scale for the root note in the specified mode
  const scale = getScale(root, modeLabel, notesWithScales);

  // Map each note in the scale to the chord corresponding to the mode in chordProgression
  const progression = chordProgression.map((progressionMode, index) => {
    const scaleNote = scale[index % scale.length]; // Wrap around scale if progression exceeds its length
    try {
      const triad = getTriad(scaleNote, progressionMode, notesWithScales);
      return { root: scaleNote, mode: progressionMode, triad };
    } catch (error) {
      return { root: scaleNote, mode: progressionMode, error: error.message };
    }
  });

  return progression;
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
        throw new Error(`Unable to render scale: all options exhausted for the first note`);
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




export const notesWithScales = generateAllScales(); // Generate and cache scales


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
  getChordProgression: (root, modeLabel) =>
    getChordProgression(root, modeLabel, notesWithScales, chordProgression),
  getTriad: (root, modeLabel) => getTriad(root, modeLabel, notesWithScales),
  getScale: (root, modeLabel) => getScale(root, modeLabel, notesWithScales),
  findScalesContainingNotes: (givenNotes, options = {}) =>
    findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options),
};

export default backendLibrary;

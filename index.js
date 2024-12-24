// Constants
const SHARP = '#';
const FLAT = '♭';
const WHOLE_STEP = 2;
const HALF_STEP = 1;

// Notes with labels
const notes = [
  { labels: ['C'] },
  { labels: [`D${FLAT}`, `C${SHARP}`] },
  { labels: ['D'] },
  { labels: [`E${FLAT}`, `D${SHARP}`] },
  { labels: ['E'] },
  { labels: ['F'] },
  { labels: [`G${FLAT}`, `F${SHARP}`] },
  { labels: ['G'] },
  { labels: [`A${FLAT}`, `G${SHARP}`] },
  { labels: ['A'] },
  { labels: [`B${FLAT}`, `A${SHARP}`] },
  { labels: ['B'] },
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
  const modeIndex = modes.findIndex(mode => mode.label === modeLabel);
  if (modeIndex === -1) {
    throw new Error(`Mode '${modeLabel}' not found.`);
  }

  // Shift the Ionian formula by the mode index
  const modeFormula = shiftArray(modeIndex, ionianFormula);

  // Generate the scale using the mode formula
  let scale = [];
  let currentIndex = startIndex;

  modeFormula.forEach(step => {
    scale.push(notes[currentIndex].labels[0]); // Use the first label for simplicity
    currentIndex = (currentIndex + step) % notes.length; // Wrap around the chromatic scale
  });

  return scale;
}

function generateAllScales() {
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

function findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options = {}) {
  // Normalize the given notes for case-insensitivity
  const normalizedNotes = givenNotes.map(note => note.toLowerCase());

  // Extract options
  const { modes: allowedModes } = options;

  // Filter scales that contain all the given notes
  const matchingScales = [];

  notesWithScales.forEach(note => {
    note.scales.forEach(scaleObj => {
      // Skip modes not in the allowedModes array (if specified)
      if (allowedModes && !allowedModes.includes(scaleObj.mode)) {
        return;
      }

      const scaleNotes = scaleObj.scale.map(note => note.toLowerCase());

      if (normalizedNotes.every(note => scaleNotes.includes(note))) {
        // Map the requested notes to their degrees in the scale
        const degrees = normalizedNotes.map(normalizedNote => {
          const degreeIndex = scaleNotes.indexOf(normalizedNote);

          // Determine the corresponding chord using the chord progression
          const chordRoot = scaleObj.scale[degreeIndex];
          const chordMode = chordProgression[degreeIndex % chordProgression.length];
          const chord = getTriad(chordRoot, chordMode, notesWithScales);

          return {
            note: normalizedNote,
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

  // Extract the scale
  const scale = scaleObj.scale;

  // Get the triad notes: 1st, 3rd, and 5th degrees
  const triad = [scale[0], scale[2], scale[4]];

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


// Example usage
const notesWithScales = generateAllScales(); // Generate and cache scales
const givenNotes = ['C', 'E', 'G'];
const options = { modes: ['ionian', 'aeolian'] }; // Only include these modes
const matchingScales = findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options);
console.dir(matchingScales, { depth: null });
/*
// Example usage
console.log(getScale("A", "aeolian", notesWithScales));
console.log(getScale("A", "locrian", notesWithScales));

console.log(getTriad("A", "locrian", notesWithScales)); // Output: ["A", "C", "E♭"]
console.log(getTriad("C", "ionian", notesWithScales));  // Output: ["C", "E", "G"]

// Generate the chord progression
const progressionChords = getChordProgression("C", "ionian", chordProgression, notesWithScales);
console.log(progressionChords);

*/


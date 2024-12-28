const SHARP = "♯";
const FLAT = "♭";
const WHOLE_STEP = 2;
const HALF_STEP = 1;

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

export function findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options = {}) {
  const normalizedNotes = givenNotes.map((note) =>
    Array.isArray(note) ? note.map((n) => n.toLowerCase()) : note.toLowerCase()
  );

  const { modes: allowedModes } = options;

  const matchingScales = [];

  notesWithScales.forEach((note) => {
    note.scales.forEach((scaleObj) => {
      if (allowedModes && !allowedModes.includes(scaleObj.mode)) return;

      const scaleNotes = scaleObj.scale.map((noteLabels) =>
        noteLabels.map((label) => label.toLowerCase())
      );

      const allNotesMatch = normalizedNotes.every((givenNote) => {
        if (Array.isArray(givenNote)) {
          return givenNote.some((noteOption) =>
            scaleNotes.some((scaleNote) => scaleNote.includes(noteOption))
          );
        }
        return scaleNotes.some((scaleNote) => scaleNote.includes(givenNote));
      });

      if (allNotesMatch) {
        let degrees = normalizedNotes.map((givenNote) => {
          let matchedNote;
          if (Array.isArray(givenNote)) {
            matchedNote = givenNote.find((noteOption) =>
              scaleNotes.some((scaleNote) => scaleNote.includes(noteOption))
            );
          } else {
            matchedNote = givenNote;
          }

          const degreeIndex = scaleNotes.findIndex((scaleNote) => scaleNote.includes(matchedNote));

          const chordRoot = scaleObj.scale[degreeIndex][0];
          const progressionData = chordProgression[degreeIndex % chordProgression.length];
          const chord = getTriad(chordRoot, progressionData.mode, notesWithScales);

          const degree = degreeIndex + 1
          return {
            note: matchedNote,
            degree,
            chord,
            name: `${chordRoot} ${progressionData.shortName} (${degree})`, // E.g., "C maj" or "G min"
          };
        });

        // Sort degrees to match the scale order
        degrees = degrees.sort((a, b) => a.degree - b.degree);

        matchingScales.push({
          name: `${note.labels[0]} ${scaleObj.mode}`,
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
  getChordProgression: (root, modeLabel) =>
    getChordProgression(root, modeLabel, notesWithScales, chordProgression),
  getTriad: (root, modeLabel) => getTriad(root, modeLabel, notesWithScales),
  getScale: (root, modeLabel) => getScale(root, modeLabel, notesWithScales),
  findScalesContainingNotes: (givenNotes, options = {}) =>
    findScalesContainingNotes(givenNotes, notesWithScales, chordProgression, options),
};

export default backendLibrary;


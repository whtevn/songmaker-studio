const SHARP = "♯";
const FLAT = "♭";
const DIMINISHED = "°";
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
  { label: "ionian", description: "Major scale", name: "major" },
  { label: "dorian", description: "Minor scale with a raised 6th" },
  { label: "phrygian", description: "Minor scale with a lowered 2nd" },
  { label: "lydian", description: "Major scale with a raised 4th" },
  { label: "mixolydian", description: "Major scale with a lowered 7th" },
  { label: "aeolian", description: "Natural minor scale", name: "minor" },
  { label: "locrian", description: "Minor scale with a lowered 2nd and 5th" },
];

const chordProgression = [
  { mode: "ionian", type: "major" },
  { mode: "aeolian", type: "minor" },
  { mode: "aeolian", type: "minor" },
  { mode: "ionian", type: "major" },
  { mode: "ionian", type: "major" },
  { mode: "aeolian", type: "minor" },
  { mode: "locrian", type: "diminished" },
];

const chordProgressionIndicator = {
  "major": "",
  "minor": "m",
  "diminished": DIMINISHED,
}

const chordProgressionShortName = {
  "major": "maj",
  "minor": "min",
  "diminished": "dim",
}

const romanNumerals = [
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii"
]

secondaryDominantResolutionStrength = [
  -1,
  2,
  2,
  1,
  3,
  2,
  -1
]

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

function chordProgressionFor(modeLabel){
  const modeIndex = modes.findIndex((m) => m.label === modeLabel);
  const shiftedProgression = shiftArray(modeIndex, chordProgression);
  return shiftedProgression
}

function generateTriad(key, chordType) {
  const rootIndex = notes.findIndex(note => note.labels.includes(key));
  if (rootIndex === -1) throw new Error(`Invalid key: ${key}`);

  const formula = chordFormulas[chordType];
  if (!formula) throw new Error(`Invalid chord type: ${chordType}`);

  return formula.map(interval => {
    const noteIndex = (rootIndex + interval) % NOTES_PER_OCTAVE;
    return notes[noteIndex]; // Return the first label for simplicity
  });
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



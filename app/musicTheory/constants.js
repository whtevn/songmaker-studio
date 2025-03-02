export const SHARP = "♯";
export const FLAT = "♭";
export const DIMINISHED = "°";
export const DOMINANT = "7";
export const WHOLE_STEP = 2;
export const HALF_STEP = 1;
export const A4_FREQUENCY = 440; // Standard pitch for A4
export const NOTES_PER_OCTAVE = 12;
export const ENHARMONIC_SPELLING = [ "A", "B", "C", "D", "E", "F", "G" ];

export const diatonicScale = [WHOLE_STEP, WHOLE_STEP, HALF_STEP, WHOLE_STEP, WHOLE_STEP, WHOLE_STEP, HALF_STEP]

export const intervals = {
  root: 0,
  major2nd: 2,
  major3rd: 4,
  perfect4th: 5,
  perfect5th: 7,
  minor3rd: 3,
  minor7th: 10,  
  major7th: 11,
  diminished5th: 6,
  diminished7th: 9, 
  augmented5th: 8,
  major6th: 9 
};

export const chordFormulas = {
  major: [intervals.root, intervals.major3rd, intervals.perfect5th],
  minor: [intervals.root, intervals.minor3rd, intervals.perfect5th],
  diminished: [intervals.root, intervals.minor3rd, intervals.diminished5th],
  augmented: [intervals.root, intervals.major3rd, intervals.augmented5th],
  sus2: [intervals.root, intervals.major2nd, intervals.perfect5th],
  sus4: [intervals.root, intervals.perfect4th, intervals.perfect5th],
  dominant7: [intervals.root, intervals.major3rd, intervals.perfect5th, intervals.minor7th],
  dominant9: [intervals.root, intervals.major3rd, intervals.perfect5th, intervals.minor7th, intervals.major2nd],
  dominant11: [intervals.root, intervals.major3rd, intervals.perfect5th, intervals.minor7th, intervals.major2nd, intervals.perfect4th],
  dominant13: [intervals.root, intervals.major3rd, intervals.perfect5th, intervals.minor7th, intervals.major2nd, intervals.perfect4th, intervals.major6th]
};

export const CHORD_QUALITY = {
  MAJOR: {
    name: "major",
    shortName: "maj",
    mode: "ionian",
    steps: chordFormulas.major,
  },
  MINOR: {
    name: "minor",
    shortName: "min",
    mode: "aeolian",
    symbol: "m",
    steps: chordFormulas.minor,
  },
  DIMINISHED: {
    name: "diminished",
    shortName: "dim",
    symbol: "°",
    steps: chordFormulas.diminished,
  },
  AUGMENTED: {
    name: "augmented",
    shortName: "aug",
    symbol: "+",
    steps: chordFormulas.augmented,
  },
  DOMINANT: {
    name: "dominant",
    shortName: "dom",
    mode: "mixolydian",
    symbol: "7",
    steps: chordFormulas.dominant7,
  },
  DOMINANT9: {
    name: "dominant 9",
    shortName: "dom9",
    mode: "mixolydian",
    symbol: "9",
    steps: chordFormulas.dominant9,
  },
  DOMINANT13: {
    name: "dominant 13",
    shortName: "dom13",
    mode: "mixolydian",
    symbol: "13",
    steps: chordFormulas.dominant13,
  }
};

export const notes = [
  { enharmonics: ["C", `B${SHARP}`], natural: true },
  { enharmonics: [`D${FLAT}`, `C${SHARP}`], natural: false },
  { enharmonics: ["D"], natural: true },
  { enharmonics: [`E${FLAT}`, `D${SHARP}`], natural: false },
  { enharmonics: ["E", `F${FLAT}`], natural: true },
  { enharmonics: ["F", `E${SHARP}`], natural: true },
  { enharmonics: [`G${FLAT}`, `F${SHARP}`], natural: false },
  { enharmonics: ["G"], natural: true },
  { enharmonics: [`A${FLAT}`, `G${SHARP}`], natural: false },
  { enharmonics: ["A"], natural: true },
  { enharmonics: [`B${FLAT}`, `A${SHARP}`], natural: false },
  { enharmonics: ["B", `C${FLAT}`], natural: true },
];

export const modes = [
  { name: "ionian", description: "Major scale", quality: "major" },
  { name: "dorian", description: "Minor scale with a raised 6th" },
  { name: "phrygian", description: "Minor scale with a lowered 2nd" },
  { name: "lydian", description: "Major scale with a raised 4th", quality: "augmented" },
  { name: "mixolydian", description: "Major scale with a lowered 7th" },
  { name: "aeolian", description: "Natural minor scale", quality: "minor" },
  { name: "locrian", description: "Minor scale with a lowered 2nd and 5th", quality: "diminished" },
];

export const chordProgression = [
   CHORD_QUALITY.MAJOR,
   CHORD_QUALITY.MINOR,
   CHORD_QUALITY.MINOR,
   CHORD_QUALITY.MAJOR,
   CHORD_QUALITY.MAJOR,
   CHORD_QUALITY.MINOR,
   CHORD_QUALITY.DIMINISHED,
];

export const romanNumerals = [
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii"
]

export const secondaryDominantResolutionStrength = [
  -1, 
  2,
  2,
  1,
  3,
  2,
  -1
]

export const chordExtensions = [
  { id: "6", semitones: 9, label: "Major 6th" }, 
  { id: "m7", semitones: 10, label: "Minor 7th" },
  { id: "M7", semitones: 11, label: "Major 7th" },
  { id: "9", semitones: 14, label: "Major 9th" },
  { id: "11", semitones: 17, label: "Perfect 11th" },
  { id: "13", semitones: 21, label: "Major 13th" },
];

export const chordAlterations = [
  { id: "b9", semitones: 13, label: "Flat 9th" },
  { id: "#9", semitones: 15, label: "Sharp 9th" },
  { id: "#11", semitones: 18, label: "Sharp 11th" },
  { id: "b13", semitones: 20, label: "Flat 13th" },
];


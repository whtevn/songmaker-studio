export const WRITING = "writing"
export const RECORDING = "recording"
export const RECORDED = "recorded"
export const RELEASED = "released"
export const STATUS_SET = [
  WRITING,
  RECORDING,
  RECORDED,
  RELEASED
]

export const INTRO = "Intro"
export const VERSE = "Verse"
export const PRECHORUS = "Pre-Chorus"
export const CHORUS = "Chorus"
export const BRIDGE = "Bridge"
export const REFRAIN = "Refrain"
export const INTERLUDE = "Interlude"
export const OUTRO = "Outro"

export const orderedSectionOptions = [
  INTRO,
  VERSE,
  PRECHORUS,
  CHORUS,
  BRIDGE,
  REFRAIN,
  INTERLUDE,
  OUTRO,
];

export const colorDefaults = {
  [INTRO]: "pink",
  [VERSE]: "fuchsia",
  [PRECHORUS]: "amber",
  [CHORUS]: "yellow",
  [BRIDGE]: "emerald",
  [REFRAIN]: "cyan",
  [INTERLUDE]: "blue",
  [OUTRO]: "violet",
}

import React, { useState } from "react";

const ROOT_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Renders a single line of lyrics, splitting it into clickable spaces and words.
 *
 * @param {object} props
 * @param {string} props.line - The raw string of the lyric line.
 * @param {number} props.lineIndex - Which line number this is in the section.
 * @param {function} props.onAssignRoot - Callback when a user clicks to assign a root note.
 *        Receives parameters (lineIndex, wordIndex, position).
 * @param {array} props.trailingNotes - Notes assigned after the last word.
 * @param {object} props.selected - The currently selected position for assigning a root note.
 * @param {function} props.setSelected - Function to update the selected word/space.
 */
function LyricLine({ line, lineIndex, onAssignRoot, trailingNotes = [], selected, setSelected }) {
  const words = line.trim().length > 0 ? line.split(" ") : [""];

  return (
    <div className="flex flex-wrap items-center py-1">
      {words.map((word, wordIndex) => (
        <React.Fragment key={`${lineIndex}-${wordIndex}`}>
          <div className={`flex flex-col items-center ${selected?.lineIndex === lineIndex && selected?.wordIndex === wordIndex && selected?.position === "before" ? "bg-gray-600" : "hover:bg-zinc-800 text-gray-400"}`}>
            {/* Clickable space BEFORE the word */}
            <span
              className={`cursor-pointer px-1 `}
              onClick={() => setSelected({ lineIndex, wordIndex, position: "before" })}
            >
              &nbsp;
            </span>
            {/* Empty space for potential chord placement */}
            <span
              className={`cursor-pointer px-1`}
              onClick={() => setSelected({ lineIndex, wordIndex, position: "before" })}
            >
              &nbsp;
            </span>
          </div>
          <div className={`flex flex-col items-center ${selected?.lineIndex === lineIndex && selected?.wordIndex === wordIndex && selected?.position === "on" ? "bg-gray-600" : "hover:bg-zinc-800 text-gray-400"}`}>
            {/* Clickable word space */}
            <span
              className={`cursor-pointer px-1`}
              onClick={() => setSelected({ lineIndex, wordIndex, position: "on" })}
            >
              &nbsp;
            </span>
            {/* The word itself */}
            <span
              className="cursor-pointer px-1"
              onClick={() => setSelected({ lineIndex, wordIndex, position: "on" })}
            >
              {word}
            </span>
          </div>
        </React.Fragment>
      ))}

      {/* Ensure space AFTER last word for trailing notes/chords */}
      <div className={`flex flex-col items-center ${selected?.lineIndex === lineIndex && selected?.wordIndex === words.length && selected?.position === "after" ? "bg-gray-600" : "hover:bg-zinc-800 text-gray-400"}`}>
        <span
          className="cursor-pointer px-1"
          onClick={() => setSelected({ lineIndex, wordIndex: words.length, position: "after" })}
        >
          &nbsp;
        </span>
        <span
          className="cursor-pointer px-1"
          onClick={() => setSelected({ lineIndex, wordIndex: words.length, position: "after" })}
        >
          &nbsp;
        </span>
      </div>
    </div>
  );
}

/**
 * Renders a single section with a header and multiple lyric lines.
 *
 * @param {object} props
 * @param {object} props.section - The section data (type, lyrics, etc.).
 * @param {function} props.onAssignRoot - Callback when the user assigns a root note.
 */
export default function SectionViewer({ section, onAssignRoot }) {
  const lyricLines = section.lyrics ? section.lyrics.split("\n") : [];
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-3 mb-4">
      {/* Section Header */}
      <h2 className="text-xl font-bold mb-2 capitalize">{section.type}</h2>

      {/* Render each lyric line */}
      {lyricLines.map((line, lineIndex) => (
        <LyricLine
          key={lineIndex}
          line={line}
          lineIndex={lineIndex}
          onAssignRoot={onAssignRoot}
          trailingNotes={section.trailingNotes?.[lineIndex] || []}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
    </div>
  );
}


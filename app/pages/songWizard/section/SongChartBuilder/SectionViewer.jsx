import React, { useState } from "react";
import { useInterfaceMode } from "./context";
import scales from "~/utils/scales";
const { chordProgressionIndicator } = scales
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
function LyricLine({ line, lineIndex, onAssignRoot, trailingNotes = [], selected, setSelected, chordChart }) {
  const words = line.trim().length > 0 ? line.split(" ") : [""];

  const showNote = chord => `${chord.note}${chordProgressionIndicator[chord.type]}`

  return (
    <div className="flex flex-wrap items-center py-1">
      {words.map((word, wordIndex) => {
        const chordBefore = chordChart.find(
          (c) =>
            c.wordIndex === wordIndex &&
            c.position === "before"
        );
        const chordOn = chordChart.find(
          (c) =>
            c.wordIndex === wordIndex &&
            c.position === "on"
        );
        const chordAfter = chordChart.find(
          (c) =>
            c.wordIndex === wordIndex &&
            c.position === "after"
        );
        return <React.Fragment key={`${lineIndex}-${wordIndex}`}>
          <div className={`px-1 cursor-pointer flex flex-col items-center ${selected?.lineIndex === lineIndex && selected?.wordIndex === wordIndex && selected?.position === "before" ? "bg-gray-600" : "hover:bg-zinc-800 text-gray-400"}`}
            onClick={() => setSelected({ lineIndex, wordIndex, position: "before" })}
        >
            {/* Clickable space BEFORE the word */}
            <span>
              { chordBefore ? showNote(chordBefore.chord) : "\u00A0" }
            </span>
            {/* Empty space for potential chord placement */}
            <span >
              &nbsp;
            </span>
          </div>
          <div className={`cursor-pointer flex flex-col ${chordOn ? "pl-1" : ""} ${selected?.lineIndex === lineIndex && selected?.wordIndex === wordIndex && selected?.position === "on" ? "bg-gray-600" : "hover:bg-zinc-800 text-gray-400"}`}
              onClick={() => setSelected({ lineIndex, wordIndex, position: "on" })}
          >
            {/* Clickable word space */}
            <span>
              { chordOn ? showNote(chordOn.chord) : "\u00A0" }
            </span>
            {/* The word itself */}
            <span >
              {word}
            </span>
          </div>
          { wordIndex === words.length - 1
           && <div className={`cursor-pointer flex flex-col ${selected?.lineIndex === lineIndex && selected?.wordIndex === wordIndex && selected?.position === "after" ? "bg-gray-600" : "hover:bg-zinc-800 text-gray-400"}`}
              onClick={() => setSelected({ lineIndex, wordIndex, position: "after" })}
          >
            {/* Clickable word space */}
            <span >
              { chordAfter ? showNote(chordAfter.chord) : "\u00A0" }
            </span>
            {/* The word itself */}
            <span >
              &nbsp;
            </span>
          </div>
          }
        </React.Fragment>
      })}

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
  const { selectedWord, handleSectionWordClick } = useInterfaceMode()

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
          chordChart={section.chordChart.filter(c => c.lineIndex === lineIndex)}
          selected={selectedWord?.sectionId === section.localId && selectedWord}
          setSelected={(word) => handleSectionWordClick({...word, sectionId: section.localId})}
        />
      ))}
    </div>
  );
}



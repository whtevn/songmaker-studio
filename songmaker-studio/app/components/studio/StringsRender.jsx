import React from "react";

const Strings = ({ tuning, numFrets = 12, highlightedNotes = {} }) => {
  // Generate note colors
  const getNoteColor = (note) => {
    if (!highlightedNotes[note]) return "#ccc"; // Default gray for unhighlighted
    return highlightedNotes[note];
  };

  return (
    <svg
      viewBox={`0 0 800 ${20 + tuning.length * 30}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    >
      {/* Render strings */}
      {tuning.map((string, stringIndex) => (
        <line
          key={`string-${stringIndex}`}
          x1="0"
          y1={20 + stringIndex * 30}
          x2="800"
          y2={20 + stringIndex * 30}
          stroke="#000"
          strokeWidth="2"
        />
      ))}

      {/* Render frets */}
      {[...Array(numFrets + 1).keys()].map((fret) => (
        <line
          key={`fret-${fret}`}
          x1={fret * (800 / numFrets)}
          y1="20"
          x2={fret * (800 / numFrets)}
          y2={20 + (tuning.length - 1) * 30}
          stroke="#000"
          strokeWidth={fret === 0 ? "4" : "2"} // Thicker line for the nut
        />
      ))}

      {/* Render notes */}
      {tuning.map((openNote, stringIndex) => {
        // Generate the notes on this string
        const stringNotes = [];
        const chromaticScale = [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "F#",
          "G",
          "G#",
          "A",
          "A#",
          "B",
        ];
        const startIndex = chromaticScale.indexOf(openNote);
        for (let i = 0; i <= numFrets; i++) {
          const note = chromaticScale[(startIndex + i) % chromaticScale.length];
          stringNotes.push(note);
        }

        return stringNotes.map((note, fretIndex) => (
          <circle
            key={`note-${stringIndex}-${fretIndex}`}
            cx={fretIndex * (800 / numFrets)}
            cy={20 + stringIndex * 30}
            r="10"
            fill={getNoteColor(note)}
          />
        ));
      })}
    </svg>
  );
};

export default Strings;


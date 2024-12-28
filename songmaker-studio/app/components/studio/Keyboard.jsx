import React from "react";
import scaleFinder from "../../utils/scales";

const { notes } = scaleFinder;

const Keyboard = ({ onNoteClick, selectedNotes }) => {
  // Calculate X position of each key
  let currentX = 0; // Track horizontal position
  const keyWidth = 100; // White key width
  const blackKeyWidth = 60;
  const blackKeyOffset = 70;

  return (
    <div className="w-full max-w-3xl flex justify-center">
      <svg
        viewBox="0 0 700 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto border border-gray-300 shadow-md"
      >
        {/* Render all keys in order */}
        {notes.map((note, index) => {
          const isNatural = note.natural;
          const x = currentX;

          if (isNatural) {
            // White (natural) key
            currentX += keyWidth; // Move to next white key position
            return (
              <rect
                key={note.labels[0]}
                x={x}
                y={0}
                width={keyWidth}
                height={200}
                className={`stroke-black cursor-pointer transition-colors duration-200 ${
                  selectedNotes.includes(note.labels)
                    ? "fill-blue-300"
                    : "fill-white hover:fill-gray-200"
                }`}
                onClick={() => onNoteClick(note)}
              />
            );
          } else {
            // Black key
            return (
              <rect
                key={note.labels.join("/")}
                x={x - keyWidth + blackKeyOffset}
                y={0}
                width={blackKeyWidth}
                height={120}
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedNotes.includes(note.labels)
                    ? "fill-blue-500"
                    : "fill-black hover:fill-gray-700"
                }`}
                onClick={() => onNoteClick(note)}
              />
            );
          }
        })}
      </svg>
    </div>
  );
};

export default Keyboard;


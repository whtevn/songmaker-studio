import React, { useState } from "react";

const Keyboard = ({ onNoteClick }) => {
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const blackKeys = ["C#", "D#", null, "F#", "G#", "A#"];

  const [activeNote, setActiveNote] = useState(null);

  const handleNoteClick = (note) => {
    setActiveNote(note);
    if (onNoteClick) {
      onNoteClick(note);
    }
  };

  return (
    <svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
      {/* White keys */}
      {whiteKeys.map((key, index) => (
        <rect
          key={key}
          x={index * 100}
          y={0}
          width={100}
          height={200}
          fill={activeNote === key ? "lightblue" : "white"}
          stroke="black"
          onClick={() => handleNoteClick(key)}
        />
      ))}
      {/* Black keys */}
      {blackKeys.map((key, index) => {
        if (!key) return null; // Skip null keys
        return (
          <rect
            key={key}
            x={index * 100 + 70}
            y={0}
            width={60}
            height={120}
            fill={activeNote === key ? "lightblue" : "black"}
            onClick={() => handleNoteClick(key)}
          />
        );
      })}
      {/* Labels */}
      {whiteKeys.map((key, index) => (
        <text
          key={`label-${key}`}
          x={index * 100 + 50}
          y={180}
          textAnchor="middle"
          fontSize="20"
          fill="black"
        >
          {key}
        </text>
      ))}
    </svg>
  );
};

// Example usage
const App = () => {
  const handleNoteClick = (note) => {
    console.log(`Clicked note: ${note}`);
    // Trigger chord/scale generation here
  };

  return (
    <div>
      <h1>Interactive Keyboard</h1>
      <Keyboard onNoteClick={handleNoteClick} />
    </div>
  );
};

export default App;


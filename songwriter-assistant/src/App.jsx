import React, { useState } from "react";
import Keyboard from "./components/Keyboard";
import ChordRender from "./components/ChordRender";
import scaleFinder from "./utils/scales";

const App = () => {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [matchingScales, setMatchingScales] = useState([]);
  const [activeModes, setActiveModes] = useState([]); // Tracks selected modes for filtering

  const {
    modes,
    findScalesContainingNotes,
    renderScale,
  } = scaleFinder

  const handleNoteClick = (note) => {
    // Toggle selection for all labels in the note object
    const isSelected = note.labels.some((label) => selectedNotes.includes(label));

    setSelectedNotes((prev) =>
      isSelected
        ? prev.filter((label) => !note.labels.includes(label)) // Remove all labels
        : [...prev, ...note.labels] // Add all labels
    );
  };

  const handleModeToggle = (mode) => {
    setActiveModes((prevModes) =>
      prevModes.includes(mode)
        ? prevModes.filter((m) => m !== mode) // Remove mode if already active
        : [...prevModes, mode] // Add mode if not active
    );
  };

  const handleFindScales = () => {
    const scales = findScalesContainingNotes(selectedNotes, {
      modes: activeModes.map(mode => mode.label), // Pass active modes as filter criteria
    });
    console.log(selectedNotes, activeModes, scales)
    setMatchingScales(scales);
  };

  const handleReset = () => {
    setSelectedNotes([]);
    setMatchingScales([]);
    setActiveModes([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Interactive Keyboard</h1>
      <Keyboard onNoteClick={handleNoteClick} selectedNotes={selectedNotes} />

      {/* Mode Filter Pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {modes.map((mode) => (
          <button
            key={mode.label}
            onClick={() => handleModeToggle(mode)}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              activeModes.includes(mode)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="mt-6 space-x-4">
        <button
          onClick={handleFindScales}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Find Scales
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* Matching Scales */}
      {matchingScales.length > 0 && (
        <div className="mt-6 w-full max-w-3xl">
          <h2 className="text-xl font-bold">Matching Scales</h2>
          <ul className="list-disc pl-4">
            {matchingScales.map((scale, index) => (
              <li key={index} className="text-gray-700">
                {scale.root} {scale.mode}: {renderScale(scale.scale)}
                { /* <ChordRender degrees={scale.degrees} /> */ }
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;


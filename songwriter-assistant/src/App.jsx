import React, { useState } from "react";
import Keyboard from "./components/Keyboard";
import ScaleRender from "./components/ScaleRender";
import scaleFinder from "./utils/scales";
import PillSelector from "./components/PillSelector";

const App = () => {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [matchingScales, setMatchingScales] = useState([]);
  const { modes, findScalesContainingNotes, renderScale } = scaleFinder;

  // Preselect Ionian and Aeolian modes
  const [activeModes, setActiveModes] = useState(["ionian", "aeolian"]);

  const handleNoteClick = (note) => {
    // Toggle selection for all labels in the note object
    const isSelected = note.labels.some((label) => selectedNotes.includes(label));

    setSelectedNotes((prev) =>
      isSelected
        ? prev.filter((label) => !note.labels.includes(label)) // Remove all labels
        : [...prev, ...note.labels] // Add all labels
    );
  };

  const handleFindScales = () => {
    const scales = findScalesContainingNotes(selectedNotes, {
      modes: activeModes, // Use active modes as filter criteria
    });
    setMatchingScales(scales);
  };

  const handleReset = () => {
    setSelectedNotes([]);
    setMatchingScales([]);
    setActiveModes(["ionian", "aeolian"]); // Reset to default modes
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Interactive Keyboard</h1>
      <Keyboard onNoteClick={handleNoteClick} selectedNotes={selectedNotes} />

      {/* Mode Filter Pills */}
      <div className="mt-6 space-x-4">
        <PillSelector
          modes={modes.map((mode) => mode.label)} // Pass only the labels to the PillSelector
          onSelectionChange={setActiveModes}
          defaultSelected={["ionian", "aeolian"]}
        />
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
                <ScaleRender scale={{ ...scale, rendered: renderScale(scale.scale) }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;


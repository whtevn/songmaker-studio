import React, { useState } from "react";
import Keyboard from "./components/Keyboard";
import ScaleRender from "./components/ScaleRender";
import ScalesList from "./components/ScalesList";
import StringsRender from "./components/StringsRender";
import scaleFinder from "./utils/scales";
import PillSelector from "./components/PillSelector";

const App = () => {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [matchingScales, setMatchingScales] = useState([]);
  const { modes, findScalesContainingNotes, renderScale, allUsedNotes } = scaleFinder;

  // Preselect Ionian and Aeolian modes
  const [activeModes, setActiveModes] = useState(["ionian", "aeolian"]);

  const handleNoteClick = (note) => {
  setSelectedNotes((prev) => {
    // Check if the entire note.labels array already exists in selectedNotes
    const isSelected = prev.some(
      (selected) =>
        Array.isArray(selected) &&
        selected.length === note.labels.length &&
        selected.every((label, index) => label === note.labels[index])
    );

    // Toggle the selection of the note.labels array
    return isSelected
      ? prev.filter(
          (selected) =>
            !(
              Array.isArray(selected) &&
              selected.length === note.labels.length &&
              selected.every((label, index) => label === note.labels[index])
            )
        ) // Remove the entire array
      : [...prev, note.labels]; // Add the entire array
  });
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
      <ScalesList scales={matchingScales} />
    </div>
  );
};

function assignRandomColors(array) {
  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

  return array.reduce((acc, item) => {
    acc[item] = getRandomColor();
    return acc;
  }, {});
}


export default App;


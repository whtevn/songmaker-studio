import scaleFinder from "../../utils/scales";
import React, { useState, useCallback, useEffect } from "react";
import Keyboard from "./Keyboard";
import PillSelector from "../studio-layout/PillSelector";
import ScalesList from "../studio/ScalesList";
import { Divider } from '../catalyst-theme/divider'
import { Heading } from '../catalyst-theme/heading'
import { Text } from '../catalyst-theme/text'

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

      // Calculate the new state
      const newState = isSelected
        ? prev.filter(
            (selected) =>
              !(
                Array.isArray(selected) &&
                selected.length === note.labels.length &&
                selected.every((label, index) => label === note.labels[index])
              )
          ) // Remove the entire array
        : [...prev, note.labels]; // Add the entire array

      // Return the updated state
      return newState;
    });

  };


  useEffect(() => {
    handleFindScales();
  }, [selectedNotes, activeModes]);


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
    <div>
      <Heading>Choose A Key</Heading>
      <Text className="mb-6">Choose the notes for your chord progression, then choose a key that includes those notes</Text>
      <div className="flex flex-wrap justify-evenly items-center gap-4 w-full mt-6">
      <Keyboard onNoteClick={ handleNoteClick } selectedNotes={ selectedNotes } />
        <PillSelector defaultSelection={ ["ionian", "aeolian"] } options={ modes.map((m) => m.label) } onSelectionChange={ setActiveModes }/>
      </div>
      <Divider className="mt-6 mb-6" />
      <ScalesList scales={ matchingScales } />
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


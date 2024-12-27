import React, { useState } from "react";

const PillSelector = ({ modes, onSelectionChange }) => {
  // Default selected modes (Ionian and Aeolian)
  const [selectedModes, setSelectedModes] = useState(["ionian", "aeolian"]);

  const toggleMode = (mode) => {
    setSelectedModes((prev) => {
      const isSelected = prev.includes(mode);
      const updated = isSelected
        ? prev.filter((m) => m !== mode) // Remove if already selected
        : [...prev, mode]; // Add if not selected

      // Notify parent about changes
      onSelectionChange(updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => (
        <button
          key={mode}
          className={`px-4 py-2 rounded-full ${
            selectedModes.includes(mode)
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => toggleMode(mode)}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default PillSelector;


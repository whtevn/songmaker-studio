import React, { useState, useEffect } from "react";
import { Badge } from "../catalyst-theme/badge";

const PillSelector = ({ options, onSelectionChange, defaultSelection }) => {
  const [selectedPills, setSelectedPills] = useState(defaultSelection);

  const togglePill = (pillLabel) => {
    setSelectedPills((prev) => {
      const isSelected = prev.includes(pillLabel);
      return isSelected
        ? prev.filter((m) => m !== pillLabel) // Remove if already selected
        : [...prev, pillLabel]; // Add if not selected
    });
  };

  // Notify parent when `selectedPills` changes
  useEffect(() => {
    console.log(selectedPills);
    onSelectionChange(selectedPills);
  }, [selectedPills, onSelectionChange]);

  return (
    <div>
      {options.map((pillLabel) => (
        <button
          key={pillLabel}
          onClick={() => togglePill(pillLabel)}
          className="px-4 py-2 rounded-full text-sm font-medium"
        >
          <Badge color={selectedPills.includes(pillLabel) ? "blue" : "grey"}>
            {pillLabel.charAt(0).toUpperCase() + pillLabel.slice(1)}
          </Badge>
        </button>
      ))}
    </div>
  );
};

export default PillSelector;


import React from "react";

const Arrow = ({ start, end, id, onSelect, isSelected }) => {
  const handleClick = () => {
    onSelect(id); // Notify parent of selection
  };

  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  return (
    <svg
      width="100%"
      height="50"
      className="mt-2"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <line
        x1="0"
        y1="25"
        x2="100%"
        y2="25"
        stroke={isSelected ? "orange" : "gray"}
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};

export default Arrow;


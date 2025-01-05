import React, { useRef, useEffect } from "react";
import { useDrag } from 'react-dnd'

const LyricDisplay = ({ text }) => {
  const sections = text.split(/\n{2,}/).map((section) => section.trim());

  return (
    <div
      className="flex flex-row flex-wrap gap-4 p-4"
    >
      {sections.map((section, index) => (
        <LyricSection key={index} section={section} />
      ))}
    </div>
  );
};

const LyricSection = ({ section }) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "card",
      item: { section },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )

  return section && (
    <div className="border p-4 rounded-md w-auto min-w-[200px] max-w-[300px] cursor-grab" >
      <p className="whitespace-pre-wrap">{section.split("\n")[0]}...</p>
    </div>
  )
};

export default LyricDisplay;


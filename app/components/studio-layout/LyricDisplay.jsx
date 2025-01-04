import React from "react";
import { useDrag } from "react-dnd";

const LyricDisplay = ({ text }) => {
  const sections = text.split(/\n{2,}/).map((section) => section.trim());

  return (
    <div className="flex flex-row flex-wrap gap-4 p-4">
      {sections.map((section, index) => (
        <LyricSection key={index} section={section} />
      ))}
    </div>
  );
};

const LyricSection = ({ section }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "LYRIC",
    item: { section },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    section &&
      <div
        ref={drag}
        className={`border p-4 rounded-md w-auto min-w-[200px] max-w-[300px] ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <p className="whitespace-pre-wrap">{section.split("\n")[0]}...</p>
      </div>
  );
};

export default LyricDisplay;


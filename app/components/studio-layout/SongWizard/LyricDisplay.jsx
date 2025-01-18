import React from "react";
import { useDrag } from "react-dnd";

const LyricDisplay = ({ text }) => {
  const sections = text.split(/\n{2,}/).map((section) => section.trim());

  return (
    <div className="border border-gray-700 flex flex-row flex-wrap gap-4 mt-4 bg-black w-full p-4 rounded-lg">
      {sections.map((section, index) => (
        <LyricSection key={index} lyrics={section} />
      ))}
    </div>
  );
};

const LyricSection = ({ lyrics }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "LYRIC",
      item: { lyrics }, // Pass the section as the item being dragged
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [lyrics] // Recompute drag configuration if `lyrics` changes
  );

  return (
      <div
        ref={dragRef} // Attach dragRef to the draggable element
        className={`flex flex-row flex-wrap p-4 rounded-lg border w-auto cursor-grab border-radius-md border gap-4 ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <p className="whitespace-pre-wrap line-clamp-1 truncate hover:text-clip text-ellipsis grow">{lyrics}</p>
      </div>
  );
};

export default LyricDisplay;


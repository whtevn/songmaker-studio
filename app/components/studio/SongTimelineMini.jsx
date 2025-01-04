import React from "react";
import { useDrop } from "react-dnd";
import { useModal } from '~/context/ModalContext';
import { CheckCircleIcon } from '@heroicons/react/16/solid';


const SongTimeline = ({ store, showSummary }) => {
  const sections = store.sections;

  return (
    <div className="flex flex-wrap justify-start items-center p-4 gap-4">
      {sections.map((section, index) => (
        <TimelineSection
          key={index}
          section={section}
          onDrop={(lyric) => {
            store.applyLyrics(index, lyric)
          } }
        />
      ))}
    </div>
  );
};

export default SongTimeline;



const TimelineSection = ({ section, onDrop }) => {
  const { openModal } = useModal();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "LYRIC",
    drop: (item) => onDrop(item.section),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="flex flex-row justify-start relative">
      <div
        className={`relative p-2 flex-grow-0 text-center text-${section.color}-700 bg-${section.color}-200 mx-0 shadow-md border border-${section.color}-700 rounded-md ${
          isOver ? "py-6 border-6" : "border-2"
        }`}
        data-id={section.id}
      >
        {section.type}

        {/* Badge for sections with lyrics */}
        {section.lyrics && (
          <span className={`absolute bottom-8 bg-${section.color}-500 text-white rounded-full p-1`}>
            <CheckCircleIcon className="h-4 w-4" onClick={()=>console.log("section:", section)} />
          </span>
        )}
      </div>
    </div>
  );
};






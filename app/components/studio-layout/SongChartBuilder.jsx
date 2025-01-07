import React from "react";
import { Heading } from "~/components/catalyst-theme/heading";
import Keyboard from "~/components/studio/Keyboard";
import ScaleRender from "~/components/studio/ScaleRender";

const SongChartBuilder = ({ store }) => {
  const { sections } = store;

  const selectedScale = store.getSelectedScale()
  console.log(store)
  return (
    <>
      <ScaleRender scale={selectedScale} />
      <Keyboard onNoteClick={ ()=>{} } selectedNotes={ [] } />
      <div className="p-4">
        {sections.map((section, index) => (
          <div key={section.id || index} className="mb-6">
            {/* Section Heading */}
            <Heading level={2} className="mb-2">
              {section.type || "Untitled Section"}
            </Heading>

            {/* Section Lyrics */}
            <p className="whitespace-pre-wrap">
              {section.lyrics }
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SongChartBuilder;


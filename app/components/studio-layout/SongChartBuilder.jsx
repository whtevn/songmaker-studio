import React from "react";
import { Heading } from "~/components/catalyst-theme/heading";
import Keyboard from "~/components/studio/Keyboard";
import ScaleRender from "~/components/studio/ScaleRender";
import { Song } from "~/stores/SongObject"


const SongChartBuilder = ({ songData, updateSong }) => {
  const song = new Song(songData)
  const { sections } = song;

  return (
    <>
      <div className="rounded-md bg-black border border-gray-700 p-6">
        <Keyboard onNoteClick={ ()=>{} } selectedNotes={ [] } />
        {sections.map((section, index) => (
          <div key={section.id || index} className="mb-6 text-center">
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


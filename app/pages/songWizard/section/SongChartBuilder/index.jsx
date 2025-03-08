import { useState } from "react"
import { constructScale, constructBorrowedChord, constructParallelChord } from "~/musicTheory"
import SongKeyManager from "./SongKeyManager.jsx"
import SongKeyViewer from "./SongKeyViewer.jsx"
import ChordViewer from "./ChordViewer.jsx"
import ChordProgressionManager from "./ChordProgressionManager.jsx"
import SubstitutionManager from "./SubstitutionManager.jsx"
import SectionViewer from "./SectionViewer.jsx"
import { SongChartBuilderProvider } from "./context";

export default ({ songData, songSections }) => {
  const scale = constructScale(songData.key.root, songData.key.mode)
  const notes = scale.notes
  console.log(notes)



  return (
    <SongChartBuilderProvider>
      <div className="rounded-b-md dark:bg-black border dark:border-gray-700 p-6 pt-2">
        <div className="sticky top-0 pt-4 dark:bg-black bg-white border-b py-2">
          <SongKeyManager scale={notes} songData={songData} />
          <SongKeyViewer scale={scale} />
          <ChordProgressionManager scale={scale} songData={songData} />
          <div className="bg-white">
            <ChordViewer chords={notes} />
          </div>
          {/*<SubstitutionManager scale={notes} /> */}
        </div>

    {/*
        {songSections.map((section, index) => 
          <SectionViewer key={section.localId || index} section={section} />
        )}
        */}
      </div>
    </SongChartBuilderProvider>
  );
};


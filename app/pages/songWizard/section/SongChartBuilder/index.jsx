import { useState } from "react"
import ScaleUtil from "~/utils/scales"
import SongKeyManager from "./SongKeyManager.jsx"
import SongKeyViewer from "./SongKeyViewer.jsx"
import ChordProgressionManager from "./ChordProgressionManager.jsx"
import SectionViewer from "./SectionViewer.jsx"
import { InterfaceModeProvider } from "./context";

export default ({ songData, songSections }) => {
  const { generateScaleWithInfo } = ScaleUtil;
  const scale = generateScaleWithInfo(songData.key.root, songData.key.mode) 

  return (
    <InterfaceModeProvider>
      <div className="rounded-b-md dark:bg-black border dark:border-gray-700 p-6 pt-2">
        <div className="sticky top-0 pt-4 dark:bg-black bg-white border-b py-2">
          <SongKeyManager scale={scale} songData={songData} />
          <SongKeyViewer scale={scale} />
        </div>

        {songSections.map((section, index) => 
          <SectionViewer key={section.localId || index} section={section} />
        )}
      </div>
    </InterfaceModeProvider>
  );
};


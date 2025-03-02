import { useState } from "react"
import { constructScale, constructBorrowedChord, constructAllScales } from "~/musicTheory"
import SongKeyManager from "./SongKeyManager.jsx"
import SongKeyViewer from "./SongKeyViewer.jsx"
import ChordProgressionManager from "./ChordProgressionManager.jsx"
import SubstitutionManager from "./SubstitutionManager.jsx"
import SectionViewer from "./SectionViewer.jsx"
import { InterfaceModeProvider } from "./context";

export default ({ songData, songSections }) => {
  const scale = constructScale(songData.key.root, songData.key.mode) 

  console.log(constructAllScales())

  return (
    <InterfaceModeProvider>
      <div className="rounded-b-md dark:bg-black border dark:border-gray-700 p-6 pt-2">
        <div className="sticky top-0 pt-4 dark:bg-black bg-white border-b py-2">
          <SongKeyManager scale={scale} songData={songData} />
          <div> { scale.map(n => <div>
            {n.name}/{n.octave} {n.quality.name} <br />
            {n.chord.map(c => `${c.name}/${c.octave} `)} <br />
            {constructBorrowedChord(scale, n.degree, 'diminished').map(c => `${c.name}/${c.octave} `)}
            <hr />
          </div>
          )}</div> 
          <SongKeyViewer scale={scale} />
          <SubstitutionManager scale={scale} /> 
        </div>

    {/*
        {songSections.map((section, index) => 
          <SectionViewer key={section.localId || index} section={section} />
        )}
        */}
      </div>
    </InterfaceModeProvider>
  );
};


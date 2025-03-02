import { useState } from "react"
import { constructScale, constructBorrowedChord, constructParallelChord } from "~/musicTheory"
import SongKeyManager from "./SongKeyManager.jsx"
import SongKeyViewer from "./SongKeyViewer.jsx"
import ChordProgressionManager from "./ChordProgressionManager.jsx"
import SubstitutionManager from "./SubstitutionManager.jsx"
import SectionViewer from "./SectionViewer.jsx"
import { InterfaceModeProvider } from "./context";

export default ({ songData, songSections }) => {
  const scale = constructScale(songData.key.root, songData.key.mode) 

  return (
    <InterfaceModeProvider>
      <div className="rounded-b-md dark:bg-black border dark:border-gray-700 p-6 pt-2">
        <div className="sticky top-0 pt-4 dark:bg-black bg-white border-b py-2">
          <SongKeyManager scale={scale} songData={songData} />
          <div> { scale.map(n => {
            const borrowed = constructBorrowedChord(scale, n.degree, 'diminished')
            const parallel = constructParallelChord(scale, n.degree, 'phrygian')
            return (
              <div>
                {n.render.name}/{n.render.octave} {n.quality.name} <br />
                {n.chord.notes.map(({render}) => `${render.name}/${render.octave} `)} <br />
                {borrowed.notes.map(({render}) => `${render.name}/${render.octave} `)}<br />
                {parallel.notes.map((chord) => `${chord.render.name}/${chord.render.octave} `) } {` ${parallel.degreeModifier}${parallel.degree}`}
                <hr />
              </div>
            )
          })
          }</div> 
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


import React, { useState } from "react";
import { nanoid } from 'nanoid';
import { Text } from "~/components/catalyst-theme/text";
import { Heading } from "~/components/catalyst-theme/heading";
import { Badge, BadgeButton } from "~/components/catalyst-theme/badge";
import { Select } from  "~/components/catalyst-theme/select";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu }  from  "~/components/catalyst-theme/dropdown";
import { Description, Field, FieldGroup, Fieldset, Label, Legend } from  "~/components/catalyst-theme/fieldset";
import { XCircleIcon } from '@heroicons/react/16/solid';

import SortableCards from "~/components/common/SortableCards";
import Keyboard from "~/components/studio/Keyboard";
import ScaleRender from "~/components/studio/ScaleRender";
import Song from "~/models/Song";
import ChordProgression from "~/models/ChordProgression";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { DndProvider } from 'react-dnd'
import useCatalogStore from "~/stores/useCatalogStore";
import SectionViewer from "../component/sectionViewer";

import ScaleUtil from "~/utils/scales"


const SongChartBuilder = ({ songData, songSections }) => {
  const { generateScaleWithInfo } = ScaleUtil;
  const scale = generateScaleWithInfo(songData.key.root, songData.key.mode) 

  const onAssignRoot = (section, ...props) => {
    console.log(section, props)
  }

  return (
    <>
      <div className="rounded-b-md dark:bg-black border dark:border-gray-700 p-6 pt-2">
        <div className="sticky top-0 pt-4 dark:bg-black bg-white">
          <SongKeyManager scale={scale} songData={songData} />
        </div>

        {songSections.map((section, index) => 
          <SectionViewer key={section.id || index} section={section} onAssignRoot={(...props) => onAssignRoot(section, ...props)} />
        )}
      </div>
    </>
  );
};

const SongKeyManager = ( { scale, songData } ) => {
  const [isManagingSongKey, setIsManagingSongKey] = useState(false)
  const { notes, modes, getDegreeForScale } = ScaleUtil;
  const updateSelectedCards = (k,v) => {
    console.log({k,v})
  }
  const updateSongKey = (update) => {
    updateSong({...songData, key: { ...songData.key, ...update } })
  }

  const { getAllSongProgressions, updateSong } = useCatalogStore.getState();


  return (
        <div className="flex row border-b">
          <div className="flex-grow justify-end">
            <Heading className="gap-4 flex flex-row items-center justify-between">
              <div>
              <span>Song Key</span>
              <Dropdown>
                <DropdownButton outline>
                  <Badge color="green">{ songData.key.root }</Badge>
                </DropdownButton>
                <DropdownMenu>
                  { notes.map(note => {
                      const key = note.labels[0]; 
                      return <DropdownItem key={key} onClick={()=>updateSongKey({root: key})}>{key}</DropdownItem>
                  }) }
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownButton outline>
                  <Badge color="green">{ songData.key.mode }</Badge>
                </DropdownButton>
                <DropdownMenu>
                  { modes.map(mode => 
                      <DropdownItem key={mode.label} onClick={()=>updateSongKey({mode: mode.label})}>{mode.name || mode.label}</DropdownItem>
                  ) }
                </DropdownMenu>
              </Dropdown>
              </div>
            </Heading>
            <ChordProgressionAdder songData={songData} scale={scale} updateSelectedCards={updateSelectedCards} chordProgressionInScale/>
          </div>
        </div>
  )
}

const ChordProgressionAdder = ({songData, scale, updateSelectedCards}) => {
  const chordProgressions = useCatalogStore(state => state.chordProgressions || [])
  console.log({chordProgressions})
  const [selectedDegree, setSelectedDegree] = useState(null)
  const [chordProgression, setChordProgression] = useState([])
  const chordProgressionInScale = chordProgression.map(c => scale[c.index])
  const [inputLocation, setInputLocation] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const { addChordProgressionToSong, updateChordProgression } = useCatalogStore.getState()
  const { generateDegreeForScale, chordProgressionIndicator, chordProgressionShortName, FLAT, SHARP } = ScaleUtil;
  const addToProgression = (chord) => {
    console.log(chordProgression)
    setChordProgression([...chordProgression, chord])
  }

  const addChordProgression = () => {
    console.log(new ChordProgression({chords: chordProgression}))
    addChordProgressionToSong(songData, new ChordProgression(chordProgression))
  }

  const selectDegree = (chord) => {
    setSelectedDegree(chord.index)
  }

  const addSecondaryDominantFor = (degree) => {
    const { note, type, mode } = scale[degree]
    console.log(scale[degree])
    console.log(generateDegreeForScale(note, mode, 4))
  }

  return <>
      <div className="flex flex-row justify-evenly p-4">
        { scale.map((chord, index) => 
          <BadgeButton key={index} color={index === selectedDegree ? "blue" : "slate"} onClick={()=>isAdding ? addToProgression(chord) : selectDegree(chord)}>
            <div className="flex flex-col">
              <span>{chord.numeral}</span>
              <span>{chord.note}</span>
              <span>{chordProgressionShortName[chord.type]}</span>
            </div>
          </BadgeButton>
        ) }
      </div>
      { isAdding ?
      <>
      <DndProvider
        backend={isMobile ? TouchBackend : HTML5Backend}
        options={{ enableMouseEvents: true }} // For better compatibility
      >
        <div className="flex flex-row justify-evenly p-4">
          {
            chordProgressions.map(progression => 
              JSON.stringify(progression)
              /*
          <SortableCards
              onCardClick={()=>{}}
              cards={progression}
              setCards={(fromIndex, toIndex)=>{
                //moveSongSectionToIndexOnSong(songData, songSections[fromIndex], toIndex)
              }}
              renderCard={(chord, index) => (
                <div className="flex flex-col justify-center text-sm">
                  <div className="text-center text-sm">( {chord.numeral} )</div>
                  <div className="text-center text-sm">{chord.note} {chordProgressionIndicator[chord.type]}</div>
                </div>
              )}
            />
            */
            )
          }
          <SortableCards
              onCardClick={updateSelectedCards}
              cards={chordProgressionInScale}
              setCards={(fromIndex, toIndex)=>{
                //moveSongSectionToIndexOnSong(songData, songSections[fromIndex], toIndex)
              }}
              inputLocation={inputLocation}
              setInputLocation={setInputLocation}
              renderCard={(chord, index) => (
                <div className="flex flex-col justify-center text-sm">
                  <div className="text-center text-sm">( {chord.numeral} )</div>
                  <div className="text-center text-sm">{chord.note} {chordProgressionIndicator[chord.type]}</div>
                </div>
              )}
            />
        </div>
      </DndProvider>
        <div className="flex justify-end flex-row gap-2">
          <BadgeButton onClick={()=>setIsAdding(false)}>Cancel</BadgeButton>
          <BadgeButton onClick={()=>addChordProgression()}>Save</BadgeButton>
        </div>
        </>
        : <div className="flex justify-end">
          <BadgeButton color="orange" onClick={()=>{setSelectedDegree(null); setIsAdding(true)}}>Add Chord Progression</BadgeButton>
        </div>
      }
  </>
}


export default SongChartBuilder;


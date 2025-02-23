import React, { useState } from "react";
import { nanoid } from 'nanoid';
import { Text } from "~/components/catalyst-theme/text";
import { Heading } from "~/components/catalyst-theme/heading";
import { Badge, BadgeButton } from "~/components/catalyst-theme/badge";
import { Select } from  "~/components/catalyst-theme/select";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu }  from  "~/components/catalyst-theme/dropdown";
import { Description, Field, FieldGroup, Fieldset, Label, Legend } from  "~/components/catalyst-theme/fieldset";

import SortableCards from "~/components/common/SortableCards";
import Keyboard from "~/components/studio/Keyboard";
import ScaleRender from "~/components/studio/ScaleRender";
import Song from "~/models/Song"
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { DndProvider } from 'react-dnd'
import useCatalogStore from "~/stores/useCatalogStore";

import ScaleUtil from "~/utils/scales"


const SongChartBuilder = ({ songData, songSections }) => {
  //const workingOnSong = useCatalogStore((state) => state.workingOnSong)
  const { addChordProgressionToSong, updateChordProgression, getAllSongProgressions, updateSong } = useCatalogStore.getState();

  const { notes, modes, generateScaleWithInfo } = ScaleUtil;
  const [isManagingSongKey, setIsManagingSongKey] = useState(false)

  const scale = generateScaleWithInfo(songData.key.root, songData.key.mode) 

  const updateSelectedCards = (k,v) => {
    console.log({k,v})
  }

  const updateSongKey = (update) => {
    updateSong({...songData, key: { ...songData.key, ...update } })
  }

  return (
    <>
      <div className="rounded-b-md dark:bg-black border dark:border-gray-700 p-6">
        { isManagingSongKey ?
            <>
        <Heading className="gap-4 flex flex-row items-center">
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
        </Heading>
        <ChordProgressionAdder scale={scale} updateSelectedCards={updateSelectedCards} chordProgressionInScale/>
        </>
        :
        <div className="flex flex-row justify-end">
          <BadgeButton color="orange" onClick={()=>setIsManagingSongKey(true)}>Manage Song Key</BadgeButton>
        </div>
        }

        {songSections.map((section, index) => (
          <div key={section.id || index} className="mb-6">
            {/* Section Heading */}
            <Heading level={2} className="mb-2">
              {section.type || "Untitled Section"}
            </Heading>

            {/* Section Lyrics */}
            <SelectableLyrics section={section} scale={scale} />
          </div>
        ))}
      </div>
    </>
  );
};

const ChordProgressionAdder = ({scale, updateSelectedCards}) => {
  const [chordProgression, setChordProgression] = useState([])
  const chordProgressionInScale = chordProgression.map(c => scale[c.index])
  const [inputLocation, setInputLocation] = useState(0)
  const addToProgression = (chord) => {
    setChordProgression([...chordProgression, {index: chord.index, localId: nanoid()}])
  }

  return <>
        <div className="flex flex-row justify-evenly p-4">
          { scale.map(chord => 
            <BadgeButton key={chord.note} color="blue" onClick={()=>addToProgression(chord)} >{chord.note} {chord.shortName}</BadgeButton>) }
        </div>
      <DndProvider
        backend={isMobile ? TouchBackend : HTML5Backend}
        options={{ enableMouseEvents: true }} // For better compatibility
      >
        <div className="flex flex-row justify-evenly p-4">
          <SortableCards
              onCardClick={updateSelectedCards}
              cards={chordProgressionInScale}
              setCards={(fromIndex, toIndex)=>{
                //moveSongSectionToIndexOnSong(songData, songSections[fromIndex], toIndex)
              }}
              inputLocation={inputLocation}
              setInputLocation={setInputLocation}
              renderCard={(chord, index) => (
                <div className="flex flex-col justify-center">
                  <div className="text-center">( {chord.numeral} )</div>
                  <div className="text-center">{chord.note} {chord.shortName}</div>
                </div>
              )}
            />
        </div>
      </DndProvider>
  </>
}

const SelectableLyrics = ({section, scale}) => {
  const lyrics = section.lyrics;
  const lyricSet = lyrics.split("\n");
  const [ tmpChord, setTmpChord ] = useState({})
  const { updateSongSection } = useCatalogStore.getState()

  const selectedLine = tmpChord.line;
  const selectedWord = tmpChord.word;
  const selectedChord = tmpChord.chord;

  const chooseText = (line) => {
    setTmpChord({line});
  };

  const updateChordChart = (update) => {
    const originalChart = section.chordChart || []
    const updatedChord = {...tmpChord, ...update}
    const { word, chord, line } = updatedChord
    if( word != undefined && chord != undefined ){
      console.log("WHAAAT")
      updateSongSection({ ...section, chordChart: [...originalChart, updatedChord] })
      setTmpChord( { } )
    } else {
      setTmpChord(updatedChord)
    }
  }

  return <div className="cursor-pointer">
    {lyricSet.map((l, i) => 
      <div key={`set${i}`}>
        { selectedLine === i ?
          <>
            { lyricSet[i].split(" ").map((w, i) => <BadgeButton onClick={()=>updateChordChart({word: i})} color={i === selectedWord ? "green" : "slate"} key={i}>{w}</BadgeButton>) }
            <div className="flex flex-row justify-evenly p-4">
              { scale.map((chord, i) => 
                <BadgeButton key={`chord${i}`} color={selectedChord?.index === i ? "blue" : "slate"} onClick={()=>updateChordChart({chord})} >{chord.note} {chord.shortName}</BadgeButton>) }
            </div>
          </>
          : <>
          <Text key={`lyrics${i}`}  onClick={()=>chooseText(i)} className="flex flex-row gap-2">
            {l.split(" ").map((w,k) => {

              const chord = section.chordChart?.filter(({line, word}) => line === i && word === k).map(({chord}) => chord?.note)[0]
              return (
                <span key={`${i}${k}`} className="flex flex-col justify-end">
                  <span>{ chord }</span>
                  <span>{`${w}`}</span>
                </span>
              )
            })}
          </Text>
          </>
        }
      </div>
    )}
  </div>
}

export default SongChartBuilder;



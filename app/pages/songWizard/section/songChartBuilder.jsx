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
  const updateSongKey = (update) => {
    updateSong({...songData, key: { ...songData.key, ...update } })
  }
  const { addChordProgressionToSong, updateChordProgression, getAllSongProgressions, updateSong } = useCatalogStore.getState();

  const { notes, modes, generateScaleWithInfo } = ScaleUtil;
  const [isManagingSongKey, setIsManagingSongKey] = useState(false)

  const scale = generateScaleWithInfo(songData.key.root, songData.key.mode) 

  const updateSelectedCards = (k,v) => {
    console.log({k,v})
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
  const chordChard = section.chordChard || [];
  const [ selectedLine, setSelectedLine ] = useState(null);
  const [ selectedWord, setSelectedWord ] = useState(null);
  const [ selectedChord, setSelectedChord ] = useState(null);

  const chooseText = (i) => {
    setSelectedLine(i);
    setSelectedWord(null);
  };

  const updateChordChart = ({word, chord}) => {
    if(word) setSelectedWord(word)
    if(chord) setSelectedWord(chord)
    if(selectedWord && selectedChord){
      // selected chord needs to be turned into an actual chord { index, mode, extensions }
      chordChart.push({line: selectedLine, word: selectedWord, chordRootIndex: selectedChord})
    }
  }

  return <div className="cursor-pointer">
    {lyricSet.map((l, i) => 
      <>
        { selectedLine === i ?
          <>
            { lyricSet[i].split(" ").map((w, i) => <BadgeButton onClick={()=>setSelectedWord(i)} color={i === selectedWord ? "green" : "slate"} >{w}</BadgeButton>) }
            <div className="flex flex-row justify-evenly p-4">
              { scale.map((chord, i) => 
                <BadgeButton key={i} color={selectedChord === i ? "blue" : "slate"} onClick={()=>setSelectedChord(i)} >{chord.note} {chord.shortName}</BadgeButton>) }
            </div>
          </>
          : <Text key={`lyrics${i}`}  onClick={()=>chooseText(i)} >{l}</Text>
        }
      </>
    )}
  </div>
}

export default SongChartBuilder;


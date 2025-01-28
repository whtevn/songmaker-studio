import React, { useEffect, useRef, useState } from "react";
import SortableCards from "~/components/common/SortableCards";
import { Heading } from "~/components/catalyst-theme/heading";
import { Badge } from "~/components/catalyst-theme/badge";
import { Divider } from "~/components/catalyst-theme/divider";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '~/components/catalyst-theme/dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/catalyst-theme/table';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Field, Fieldset, Label } from "~/components/catalyst-theme/fieldset";
import { Input } from "~/components/catalyst-theme/input";
import { useModal } from '~/context/ModalContext';
import { Song } from "~/models/Song"


const SongTimeline = ({ songData, updateSong }) => {
  const song = new Song(songData)
  const { sections, tempo, timeSignature, duration } = song;

  const [inputLocation, setInputLocation] = React.useState(sections.length-1);
  const sectionOptions = [
    { type: "Intro", color: "pink" },
    { type: "Verse", color: "fuchsia" },
    { type: "Pre-Chorus", color: "amber" },
    { type: "Chorus", color: "yellow" },
    { type: "Bridge", color: "emerald" },
    { type: "Refrain", color: "cyan" },
    { type: "Interlude", color: "blue" },
    { type: "Outro", color: "violet" },
  ];

  const { openModal } = useModal();


  const handleNameChange = (index, newName) => {
    const updatedSections = sections.map((section, idx) => {
      if (idx === index) {
        return { ...section, name: newName };
      }
      return section;
    });
    song.setSections(updatedSections);
  };

  const handleTypeChange = (index, newType) => {
    const updatedSections = sections.map((section, idx) => {
      if (idx === index) {
        return { ...section, type: newType };
      }
      return section;
    });
    song.setSections(updatedSections);
  };

  const handleMeasureChange = (index, newMeasures) => {
    const updatedSections = sections.map((section, idx) => {
      if (idx === index) {
        return { ...section, measures: newMeasures };
      }
      return section;
    });
    song.setSections(updatedSections);
  };

  const calculateSectionTime = (measures) => {
    if (!tempo || !timeSignature) return 0;
    const [beatsPerMeasure] = timeSignature.split("/").map(Number); // Extract beats per measure from timeSignature
    const secondsPerBeat = 60 / tempo;
    return Math.floor(measures * beatsPerMeasure * secondsPerBeat);
  };

  const secondsToMinuteNotation = (seconds) => {
    if(!seconds) return { minutes: 0, seconds: 0, asString: "0m 00s" }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return {
      minutes,
      seconds: remainingSeconds,
      asString: `${minutes}m ${remainingSeconds}s`,
    };
  };

  const handleDeleteSection = (index) => {
    if (sections.length > 1) {
      const updatedSections = [
        ...sections.slice(0, index),
        ...sections.slice(index + 1),
      ];
      song.setSections(updatedSections);
    }
  };

  const handleAddSection = (newSection) => {
    if (inputLocation !== null) {
      const updatedSections = [
        ...sections.slice(0, inputLocation),
        newSection,
        ...sections.slice(inputLocation),
      ];
      song.setSections(updatedSections);
      setInputLocation(inputLocation + 1);
    } else {
      song.setSections([...sections, newSection]);
    }
    updateSong(song)
  };

  const totalTime = sections.reduce(
    (total, section) => total + calculateSectionTime(section.measures),
    0
  );

  const updateSelectedCards = (section) => {
    openModal("showSectionDetails", section)
  }

  return (
    <div className="rounded-md bg-black border border-gray-700">
      <div className="p-4 mt-2 flex flex-col">
        <div className="flex justify-evenly flex-wrap border-b-4 border-gray-900 pb-4" >
        { sectionOptions.map((option, index) => 
          <Badge key={index} onClick={()=>handleAddSection(option)} color={option.color} className="p-8 m-2 cursor-pointer">{ option.type }</Badge>
        )
        }
        </div>
      </div>
      <div className="p-4 flex flex-col">
        <SortableCards
          onCardClick={updateSelectedCards}
          store={song}
          cards={song.sections}
          setCards={(c)=>{
            song.setSections(c)
            updateSong(song)
          }}
          onApplyLyrics={(index, lyrics)=>{
            song.applyLyrics(index, lyrics)
            updateSong(song)
          }}
          inputLocation={inputLocation}
          setInputLocation={setInputLocation}
        />
      </div>
    </div>
  );
};

export default SongTimeline;


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
import Song from "~/models/Song"
import SongSection from "~/models/SongSection"
import useCatalogStore from "~/stores/useCatalogStore";

import { orderedSectionOptions, colorDefaults } from '~/models/Constants'

const SongTimeline = ({ songData, songSections }) => {

  const [inputLocation, setInputLocation] = React.useState(songSections.length-1);
  const sectionOptions = orderedSectionOptions.map(type => ({ type, color: colorDefaults[type] }))

  const { addSongSectionToSong, addSongSectionToSongAtIndex, removeSongSectionFromSong, deleteSongSection, updateSongSection, moveSongSectionToIndexOnSong } = useCatalogStore.getState()

  const { openModal } = useModal();

  const handleDeleteSection = (songSection) => {
    if (songSections.length > 1) {
      removeSongSectionFromSong(songData, songSection)
      deleteSongSection(songSection)
    }
  };

  const handleAddSection = (newSection) => {
    const section = new SongSection({...newSection, songId: songData.localId})
    if (inputLocation !== null) {
      addSongSectionToSongAtIndex(songData, section, inputLocation)
      setInputLocation(inputLocation + 1);
    } else {
      addSongSectionToSong(songData, section)
    }
  };


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
          cards={songSections}
          setCards={(fromIndex, toIndex)=>{
            moveSongSectionToIndexOnSong(songData, songSections[fromIndex], toIndex)
          }}
          onApplyLyrics={(index, lyrics)=>{
            updateSongSection({ ...songSections[index], lyrics })
          }}
          inputLocation={inputLocation}
          setInputLocation={setInputLocation}
        />
      </div>
    </div>
  );
};

export default SongTimeline;


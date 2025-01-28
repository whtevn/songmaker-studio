import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { Link } from "~/components/catalyst-theme/link";
import { Button } from "~/components/catalyst-theme/button";
import { Heading } from "~/components/catalyst-theme/heading";
import { Input } from "~/components/catalyst-theme/input";
import { PencilSquareIcon, XMarkIcon, CheckIcon } from "@heroicons/react/16/solid";
import { useModal } from "~/context/ModalContext";

import useCatalogStore from "~/stores/useCatalogStore";
import SectionDetailsDialog from "./dialog/sectionDetailsDialogue";
import SongSectionEditor from "./section/songSectionEditor";
import SongChartBuilder from "./section/songChartBuilder";
import LyricWriter from "./section/lyricWriter";

import { Song } from "~/models/Song";


export function SongWizard() {

  const modal = useModal();
  const { activeModal, closeModal, activeModalOptions } = modal;
  const { id, tab } = useParams(); // Retrieve song ID and tab from the route

  const workingOnSong = useCatalogStore((state) => state.workingOnSong)
  const songs = useCatalogStore((state) => state.songs)
  const lyricVersionStore = useCatalogStore((state) => state.lyricVersions || [] )

  const lyricVersions = lyricVersionStore
    .filter((v) => v.songId === workingOnSong)
    .sort((a, b) => b.timestamp - a.timestamp); 

  const song = songs.find(s => s.localId === workingOnSong)

  const { updateSong, addLyricVersionToSong, setWorkingOnSong } = useCatalogStore.getState();

  const [activeTab, setActiveTab] = useState(tab || "lyrics");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(song?.title || "Untitled Song");

  const headerRef = useRef(null)
  useEffect(() => {
    if(tab){
      setActiveTab(tab); // Causes re-renders every time `tab` changes
    }
  }, [tab]);
  useEffect(() => {
    setWorkingOnSong(id); // Causes re-renders every time `tab` changes
  }, [id]);

  const handleCancelTitleChange = () => {
    setIsEditing(false)
  }

  const handleSaveTitleChange = () => {
    updateSong({...song, title: tempTitle})
    setIsEditing(false)
  }

  return (
    song 
    ? <>
      <span ref={headerRef}>
        {!isEditing ? (
          <Heading className="border-gray-700 py-4">
            <span className="text-ellipsis overflow-hidden">
              {song.title || "Untitled"}
            </span>
            <Button plain onClick={() => setIsEditing(true)}>
              <PencilSquareIcon className="h-6 w-6" />
            </Button>
          </Heading>
        ) : (
          <div className="flex flex-row py-4">
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              placeholder="Enter title"
            />
            <Button plain onClick={handleCancelTitleChange}>
              <XMarkIcon className="h-6 w-6" />
            </Button>
            <Button plain onClick={handleSaveTitleChange}>
              <CheckIcon className="h-6 w-6" />
            </Button>
          </div>
        )}
      </span>
      <div className="flex justify-end">
        {["lyrics", "structure", "phrasing"].map((tabId) => (
          <Link
            key={tabId}
            href={`/song/${id}/${tabId}`}
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tabId
                ? "bg-gray-600 rounded-t-lg text-white"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
          </Link>
        ))}
      </div>
      {activeTab === "lyrics" && (
        <LyricWriter
          song={song}
          lyrics={song.lyrics}
          lyricVersions={lyricVersions}
          updateSong={(update) => updateSong({ ...song, ...update })}
          addLyricVersionToSong={addLyricVersionToSong}
          headerRef={headerRef}
        />
      )}
      {activeTab === "structure" && (
        <SongSectionEditor
          songData={song}
          updateSong={(update) => updateSong({ ...song, ...update })}
        />
      )}
      {activeTab === "phrasing" && (
        <SongChartBuilder
          songData={song}
          updateSong={(update) => updateSong({ ...song, ...update })}
        />
      )}
      {activeModal === "showSectionDetails" && (
        <SectionDetailsDialog
          isOpen
          songData={song}
          updateSong={(update) => updateSong({ ...song, ...update })}
          onClose={closeModal}
          section={activeModalOptions}
        />
      )}
    </> : <>
    <h1>loading..</h1>
    </>
  );
}

export default SongWizard;


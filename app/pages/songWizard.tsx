import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import SongSectionEditor from "~/components/studio-layout/SongWizard/SongSectionEditor";
import SongChartBuilder from "~/components/studio-layout/SongChartBuilder";
import LyricWriter from "~/components/studio-layout/SongWizard/LyricWriter";
import { Button } from "~/components/catalyst-theme/button";
import { Heading } from "~/components/catalyst-theme/heading";
import { Input } from "~/components/catalyst-theme/input";
import { PencilSquareIcon, XMarkIcon, CheckIcon } from "@heroicons/react/16/solid";
import SectionDetailsDialog from "~/components/studio-layout/SectionDetailsDialogue";
import { useModal } from "~/context/ModalContext";
import useCatalogStore from "~/stores/useCatalogStore";

export function SongWizard() {
  const { id } = useParams(); // Retrieve song ID from the route
  const catalogStore = useCatalogStore(); // Access the catalog store
  const modal = useModal();
  const { activeModal, closeModal, activeModalOptions } = modal;
  const store = useCatalogStore();

  // Retrieve the song by ID from the catalog store
  const originalSong = catalogStore.songs.find(
    (song) => song.localId === id || song.id === id
  );

  const [song, setSong] = useState(originalSong || null); // Local state for editing

  const tabs = [
    { id: "lyrics", label: "Lyrics" },
    { id: "sections", label: "Structure" },
    { id: "music", label: "Phrasing" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(song?.title || "");

  const headerRef = useRef(null);

  // Save updates back to the catalog store
  const handleSave = () => {
    handleUpdate({ title: tempTitle })
    setIsEditing(false);
  };

  const handleUpdate = (update) => {
    catalogStore.updateSong({ ...song, ...update})
    setSong((prev) => ({ ...prev, ...update }));
  }

  // Cancel editing
  const handleCancel = () => {
    setTempTitle(song?.title || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (!originalSong) {
      console.error("Song not found in catalog");
    }
  }, [originalSong]);

  if (!song) {
    return <div>Loading song...</div>;
  }

  return (
    <>
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
            <Button plain onClick={handleCancel}>
              <XMarkIcon className="h-6 w-6" />
            </Button>
            <Button plain onClick={handleSave}>
              <CheckIcon className="h-6 w-6" />
            </Button>
          </div>
        )}
      </span>
      <div className="flex justify-end">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "bg-gray-600 rounded-t-lg text-white"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "lyrics" && (
        <LyricWriter
          store={store}
          song={song}
          updateSong={handleUpdate} 
          headerRef={headerRef}
        />
      )}
      {activeTab === "sections" && (
        <SongSectionEditor
          store={store}
          song={song}
          updateSong={handleUpdate} 
        />
      )}
      {activeTab === "music" && (
        <SongChartBuilder store={{ ...song, setSong }} />
      )}
      {activeModal === "showSectionDetails" && (
        <SectionDetailsDialog
          isOpen
          onClose={closeModal}
          section={activeModalOptions}
        />
      )}
    </>
  );
}

export default SongWizard;


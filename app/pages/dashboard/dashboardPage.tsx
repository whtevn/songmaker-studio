import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import DashboardSection from "~/components/common/cardSection";
import SongPromptSection from "./section/songPromptSection";
import KeyFinderSection from "./section/keyFinderSection";
import AlbumSection from "./section/albumSection";
import NewSongDialog from "./dialog/songDialog";
import NewAlbumDialog from "./dialog/albumDialog";
import NewPromptDialog from "./dialog/songPromptDialog";
import { useModal } from "~/context/ModalContext";
import useCatalogStore from "~/stores/useCatalogStore";
import useInterfaceStore from "~/stores/useInterfaceStore";
import { SongPrompt } from "~/models/SongPrompt"

export function Dashboard() {
  const navigate = useNavigate();
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const { openModal, activeModal, closeModal } = useModal();

  const selectedAlbumId =  useInterfaceStore(state => state.selectedAlbumId);
  const { addSong, updateSong, addAlbum, updateAlbum, addSongPrompt, updateSongPrompt } = useCatalogStore.getState();

  const handleCreateSong = (newSong) => {
    addSong(newSong);
    closeModal();
  };

  const handleCreateAlbum = (newAlbum) => {
    addAlbum(newAlbum);
    closeModal();
  };

  const handleUpdateAlbum = (updatedAlbum) => {
    updateAlbum(updatedAlbum);
    closeModal();
  };

  const handleCreatePrompt = (newFragment) => {
    const prompt = new SongPrompt(newFragment)
    addSongPrompt(prompt);
    setCurrentPrompt(null)
    closeModal();
  };

  const handleUpdatePrompt = (updatedFragment) => {
    updateSongPrompt(updatedFragment);
    closeModal();
  };

  return (
    <>
      <div className="space-y-2">

        {/* Albums Section */}
        <AlbumSection
          onAdd={() => {
            openModal("newAlbum")
          }}
        />
        {/* Lyric Bank Section */}
        <SongPromptSection
          onEdit={(newCurrentPrompt) => {
            setCurrentPrompt(newCurrentPrompt)
            openModal("newPrompt")
          }}
          onAdd={() => {
            setCurrentPrompt(null)
            openModal("newPrompt")
          }}
          albumId={selectedAlbumId}
        />
        <KeyFinderSection />



      </div>
      {/* Modals */}
      {activeModal === "newAlbum" && (
        <NewAlbumDialog isOpen onClose={closeModal} onSave={currentAlbum ? handleUpdateAlbum : handleCreateAlbum } album={currentAlbum} />
      )}
      {activeModal === "newPrompt" && (
        <NewPromptDialog isOpen onClose={closeModal} onSave={currentPrompt ? handleUpdatePrompt : handleCreatePrompt} currentSongPrompt={currentPrompt} />
          
      )}
    </>
  );
}

export default Dashboard;


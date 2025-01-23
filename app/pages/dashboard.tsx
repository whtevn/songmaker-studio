import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import DashboardSection from "~/components/common/cardSection";
import SongPromptSection from "~/components/studio-layout/Dashboard/songPromptSection";
import KeyFinderSection from "~/components/studio-layout/Dashboard/keyFinderSection";
import AlbumSection from "~/components/studio-layout/Dashboard/albumSection";
import NewSongDialog from "~/components/studio-layout/Dashboard/SongDialog";
import NewAlbumDialog from "~/components/studio-layout/Dashboard/AlbumDialog";
import NewPromptDialog from "~/components/studio-layout/Dashboard/SongPromptDialog";
import { useModal } from "~/context/ModalContext";
import catalogStore from "~/stores/useCatalogStore";
import interfaceStore from "~/stores/useInterfaceStore";

export function Dashboard() {
  const navigate = useNavigate();
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const { openModal, activeModal, closeModal } = useModal();
  const store =  catalogStore();
  const interfaceState =  interfaceStore();
  const { songs, albums, prompts, addSong, updateSong, addAlbum, updateAlbum, addPrompt, updatePrompt } =store;

  const selectedAlbum = interfaceState.selectedAlbum

  const handleCreateSong = (newSong) => {
    addSong(newSong);
    closeModal();
  };

  const handleUpdateSong = (updatedSong) => {
    updateSong(updatedSong);
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
    addPrompt(newFragment);
    closeModal();
  };

  const handleUpdatePrompt = (updatedFragment) => {
    updatePrompt(updatedFragment);
    closeModal();
  };

  return (
    <>
      <div className="space-y-2">

        {/* Albums Section */}
        <AlbumSection
          store={store}
          onAdd={() => {
            setCurrentAlbum(null)
            openModal("newAlbum")
          }}
        />
        {/* Lyric Bank Section */}
        <SongPromptSection
          prompts={prompts}
          store={store}
          onEdit={(newCurrentPrompt) => {
            console.log(newCurrentPrompt)
            setCurrentPrompt(newCurrentPrompt)
            openModal("newPrompt")
          }}
          onAdd={() => {
            setCurrentPrompt(null)
            openModal("newPrompt")
          }}
          album={selectedAlbum}
        />
        <KeyFinderSection />



      </div>
      {/* Modals */}
      {activeModal === "newAlbum" && (
        <NewAlbumDialog isOpen onClose={closeModal} onSave={currentAlbum ? handleUpdateAlbum : handleCreateAlbum } album={currentAlbum} />
      )}
      {activeModal === "newPrompt" && (
        <NewPromptDialog isOpen onClose={closeModal} onSave={currentPrompt ? handleUpdatePrompt : handleCreatePrompt} lyric={currentPrompt} />
      )}
    </>
  );
}

export default Dashboard;


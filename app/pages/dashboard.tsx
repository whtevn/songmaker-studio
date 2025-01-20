import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import DashboardSection from "~/components/common/cardSection";
import SongPromptSection from "~/components/studio-layout/Dashboard/songPromptSection";
import KeyFinderSection from "~/components/studio-layout/Dashboard/keyFinderSection";
import AlbumSection from "~/components/studio-layout/Dashboard/albumSection";
import NewSongDialog from "~/components/studio-layout/Dashboard/SongDialog";
import NewAlbumDialog from "~/components/studio-layout/Dashboard/AlbumDialog";
import NewLyricFragmentDialog from "~/components/studio-layout/Dashboard/SongPromptDialog";
import { useModal } from "~/context/ModalContext";
import catalogStore from "~/stores/useCatalogStore";
import { PlusCircleIcon } from '@heroicons/react/16/solid';

export function Dashboard() {
  const navigate = useNavigate();
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentLyricFragment, setCurrentLyricFragment] = useState(null);
  const { openModal, activeModal, closeModal } = useModal();
  const store =  catalogStore();
  const { songs, albums, prompts, addSong, updateSong, addAlbum, updateAlbum, addPrompts, updatePrompts } =store;

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

  const handleCreateLyricFragment = (newFragment) => {
    addLyricFragment(newFragment);
    closeModal();
  };

  const handleUpdateLyricFragment = (updatedFragment) => {
    updateLyricFragment(updatedFragment);
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
          onEdit={() => {
            setCurrentLyricFragment(fragment)
            openModal("newLyricFragment")
          }}
          onAdd={() => {
            setCurrentLyricFragment(null)
            openModal("newLyricFragment")
          }}
        />
        <KeyFinderSection />



      </div>
      {/* Modals */}
      {activeModal === "newSong" && (
        <NewSongDialog isOpen onClose={closeModal} onSave={currentSong ? handleUpdateSong : handleCreateSong} albums={albums} song={currentSong} />
      )}
      {activeModal === "newAlbum" && (
        <NewAlbumDialog isOpen onClose={closeModal} onSave={currentAlbum ? handleUpdateAlbum : handleCreateAlbum } album={currentAlbum} />
      )}
      {activeModal === "newLyricFragment" && (
        <NewLyricFragmentDialog isOpen onClose={closeModal} onSave={currentLyricFragment ? handleUpdateLyricFragment : handleCreateLyricFragment} lyric={currentLyricFragment} />
      )}
    </>
  );
}

export default Dashboard;


import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import DashboardSection from "~/components/common/cardSection";
import SongPromptSection from "~/components/studio-layout/Dashboard/SongPromptSection";
import AlbumSection from "~/components/studio-layout/Dashboard/AlbumSection";
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
  const { songs, albums, lyricFragments, addSong, updateSong, addAlbum, updateAlbum, addLyricFragment, updateLyricFragment } = catalogStore();

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
    <div className="space-y-2">

      {/* Albums Section */}
      <AlbumSection
        albums={albums}
        onEdit={() => {
          setCurrentAlbum(album)
          openModal("newAlbum")
        }}
        onAdd={() => {
          setCurrentAlbum(null)
          openModal("newAlbum")
        }}
      />
      {/* Lyric Bank Section */}
      <SongPromptSection
        prompts={lyricFragments}
        onEdit={() => {
          setCurrentLyricFragment(fragment)
          openModal("newLyricFragment")
        }}
        onAdd={() => {
          setCurrentLyricFragment(null)
          openModal("newLyricFragment")
        }}
      />


      {/* Modals */}
      {activeModal === "newSong" && (
        <NewSongDialog isOpen onClose={closeModal} onSave={currentSong ? handleUpdateSong : handleCreateSong} albums={[]} song={currentSong} />
      )}
      {activeModal === "newAlbum" && (
        <NewAlbumDialog isOpen onClose={closeModal} onSave={currentAlbum ? handleUpdateAlbum : handleCreateAlbum } album={currentAlbum} />
      )}
      {activeModal === "newLyricFragment" && (
        <NewLyricFragmentDialog isOpen onClose={closeModal} onSave={currentLyricFragment ? handleUpdateLyricFragment : handleCreateLyricFragment} lyric={currentLyricFragment} />
      )}
    </div>
  );
}

export default Dashboard;


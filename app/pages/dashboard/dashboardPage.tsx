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
import Song from "~/models/Song"
import Album from "~/models/Album"
import SongPrompt from "~/models/SongPrompt"
import SongSection from "~/models/SongSection"
import { INTRO, OUTRO } from "~/models/Constants"




export function Dashboard() {
  const navigate = useNavigate();
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const { openModal, activeModal, closeModal } = useModal();

  const album = useCatalogStore(state => state.albums ? state.albums[0] : new Album())
  const { addSongToAlbum, updateSong, addAlbum, updateAlbum, addSongPrompt, updateSongPrompt, addSongSectionToSong } = useCatalogStore.getState();

  const handleCreateSong = (songData) => {
    //addSong(songData);
    const songId = songData.localId
    const intro = new SongSection({ type: INTRO, songId });
    const outro = new SongSection({ type: OUTRO, songId });
    addSongToAlbum(album, songData)
    addSongSectionToSong(songData, intro)
    addSongSectionToSong(songData, outro)
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
          album={album}
          onAdd={() => {
            openModal("newAlbum")
          }}
          handleCreateSong={handleCreateSong}
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
          handleCreateSong={handleCreateSong}
          albumId={album.localId}
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


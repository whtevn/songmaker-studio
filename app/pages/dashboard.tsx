import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import DashboardSection from "~/components/common/cardSection";
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
      <DashboardSection>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="flex flex-row items-center gap-2 w-[120px] cursor-pointer" onClick={() =>{
        setCurrentAlbum(null)
         openModal("newAlbum")
      }}>
<PlusCircleIcon className="h-4 w-4 cursor-pointer"  /><span>Albums</span>
</TableHeader> {/* Adjust header width */}
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {albums.map((album) => (
              <TableRow key={album.localId || album.id}>
                <TableCell className="w-8 text-center">
                  {album.image ? (
                    <img
                      src={album.image}
                      alt={`${album.name} Artwork`}
                      className="object-cover rounded-md mx-auto"
                    />
                  ) : (
                    <div className="h-[100px] w-[100px] bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded-md">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium align-middle">{album.title}</TableCell>
                <TableCell className="text-right">
                  <button
                    className="text-blue-500 hover:underline text-sm"
                    onClick={() => {
setCurrentAlbum(album)
openModal("newAlbum")
                    }} // Replace with your edit handler
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>


      </DashboardSection>
      {/* Lyric Bank Section */}
      <DashboardSection>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => {
        setCurrentLyricFragment(null)
        openModal("newLyricFragment")
      }}>
<PlusCircleIcon className="h-4 w-4 cursor-pointer"  /><span>Song Prompts</span>
</TableHeader> {/* Adjust header width */}
              <TableHeader className="w-[120px]"></TableHeader> {/* Adjust header width */}
            </TableRow>
          </TableHead>
          <TableBody>
            {lyricFragments.map((fragment) => (
              <TableRow key={fragment.localId || fragment.id}>
                <TableCell className="font-medium pre-wrap">{fragment.lines}</TableCell>
                <TableCell className="text-right">
                  <button
                    className="text-blue-500 hover:underline text-sm"
                    onClick={() => {
setCurrentLyricFragment(fragment)
openModal("newLyricFragment")
                    }} // Replace with your edit handler
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </DashboardSection>


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


import React from "react";
import { useNavigate } from "react-router";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import DashboardSection from "~/components/studio-layout/dashboardSection";
import NewSongDialog from "~/components/studio-layout/NewSongDialogue";
import NewAlbumDialog from "~/components/studio-layout/NewAlbumDialogue";
import NewLyricFragmentDialog from "~/components/studio-layout/NewLyricFragmentDialogue";
import { useModal } from "~/context/ModalContext";
import catalogStore from "~/stores/useCatalogStore";

export function Dashboard() {
  const navigate = useNavigate();
  const { openModal, activeModal, closeModal } = useModal();
  const { songs, albums, lyricFragments, addSong, addAlbum, addLyricFragment } = catalogStore();

  const handleCreateSong = (newSong) => {
    console.log({ newSong })
    addSong(newSong);
    closeModal();
  };

  const handleCreateAlbum = (newAlbum) => {
console.log("album")
    addAlbum(newAlbum);
    closeModal();
  };

  const handleCreateLyricFragment = (newFragment) => {
console.log("lyric")
    addLyricFragment(newFragment);
    closeModal();
  };

  return (
    <div className="space-y-2">
      {/* Songs Section */}
      <DashboardSection title="Songs" onAdd={() => openModal("newSong")}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Album</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((song) => (
              <TableRow key={song.localId || song.id}>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell>{song.status}</TableCell>
                <TableCell className="text-zinc-500">{song.album?.name || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardSection>

      {/* Albums Section */}
      <DashboardSection title="Albums" onAdd={() => openModal("newAlbum")}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="w-[120px]">Artwork</TableHeader> {/* Adjust header width */}
              <TableHeader>Title</TableHeader>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>


      </DashboardSection>
      {/* Lyric Bank Section */}
      <DashboardSection title="Lyric Bank" onAdd={() => openModal("newLyricFragment")}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Lines</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {lyricFragments.map((fragment) => (
              <TableRow key={fragment.localId || fragment.id}>
                <TableCell className="font-medium pre-wrap">{fragment.lines}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardSection>


      {/* Modals */}
      {activeModal === "newSong" && (
        <NewSongDialog isOpen onClose={closeModal} onSave={handleCreateSong} albums={[]} />
      )}
      {activeModal === "newAlbum" && (
        <NewAlbumDialog isOpen onClose={closeModal} onSave={handleCreateAlbum} />
      )}
      {activeModal === "newLyricFragment" && (
        <NewLyricFragmentDialog isOpen onClose={closeModal} onSave={handleCreateLyricFragment} />
      )}
    </div>
  );
}

export default Dashboard;


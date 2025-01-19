import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import DefaultAlbumIcon from "~/components/studio-layout/Dashboard/defaultAlbumIcon";
import EditInPlace from "~/components/common/editInPlace";

export default function AlbumSection({onUpdate, onAdd, store}){
  const { albums, getAlbumSongs } = store;
  console.log("wtf")
  return (
      <DashboardSection>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="flex flex-row items-center gap-2 w-[120px] cursor-pointer" onClick={onAdd}>
                <PlusCircleIcon className="h-4 w-4 cursor-pointer"  /><span>Albums</span>
              </TableHeader> 
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {albums.map((album) => (
              <AlbumSongSection album={album} getAlbumSongs={getAlbumSongs} onUpdate={onUpdate} key={album.localId || album.id} />
            ))}
          </TableBody>
        </Table>


      </DashboardSection>
  )
}

const AlbumSongSection = ({ album, getAlbumSongs, onUpdate }) => {
  const albumId = album.id || album.localId
  const songs = getAlbumSongs(albumId)
  console.log({ getAlbumSongs, songs })
  return (
    <>
    <TableRow key={album.localId || album.id}>
      <TableCell className="w-8 text-center">
        {album.image ? (
          <img
            src={album.image}
            alt={`${album.name} Artwork`}
            className="object-cover rounded-md mx-auto"
          />
        ) : (
          <DefaultAlbumIcon className="h-8 w-8 mx-auto" />
        )}
      </TableCell>
      <TableCell className="font-medium align-middle">
        <EditInPlace value={album.title} onSave={(title)=>onUpdate({...album, title})} >
          {album.title}
        </EditInPlace>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <Table>
          <TableBody>
          { songs.map((song) => (
            <TableRow key={song.localId || song.id}>
              <TableCell>{song.title}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
    </>
  )
}

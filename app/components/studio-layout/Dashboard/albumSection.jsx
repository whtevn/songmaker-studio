import { useState, useRef } from 'react'
import { STATUS_SET, WRITING, newSong } from '~/stores/useCatalogStore';
import DashboardSection from "~/components/common/cardSection";
import AlbumCoverEditor from "~/components/studio-layout/Dashboard/AlbumCoverEditor";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Listbox, ListboxOption, ListboxLabel   } from "~/components/catalyst-theme/listbox";
import { Link } from "~/components/catalyst-theme/link";
import { Text } from "~/components/catalyst-theme/text";
import { Input } from "~/components/catalyst-theme/input";
import { Heading } from "~/components/catalyst-theme/heading";
import { Divider } from "~/components/catalyst-theme/divider";
import { Badge, BadgeButton } from "~/components/catalyst-theme/badge";
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/16/solid';
import DefaultAlbumIcon from "~/components/studio-layout/Dashboard/defaultAlbumIcon";
import EditInPlace from "~/components/common/editInPlace";

export default function AlbumSection({onAdd, store}){
  const { albums, getAlbumSongs, updateAlbum, updateSong } = store;
  return (
    <DashboardSection
      title="Albums"
      onAction={onAdd}
      actionButton={<PlusCircleIcon className="h-4 w-4" />}
    >
      {albums.map((album) => (
        <AlbumSongSection
          album={album}
          store={store}
          key={album.localId || album.id}
        />
      ))}
    </DashboardSection>
  )
}

const AlbumSongSection = ({ album, store }) => {
  const { getAlbumSongs, updateAlbum, updateSong } = store;
  const [ addingSong, setAddingSong ] = useState(false)
  const [ newAlbumSong, setNewAlbumSong ] = useState(newSong())
  const albumId = album.id || album.localId
  const songs = getAlbumSongs(albumId)
  const addSongToAlbum = ({song, album}) => {
    const songWithId = newSong(song)
    store.addSong(songWithId)
    store.addSongToAlbum({album, song: songWithId})
    setAddingSong(false)
    setNewAlbumSong(newSong())
  }
  const handleTitleChange = (e) => {
    const updatedTitle = e.target.value;
    setNewAlbumSong((prevSong) => ({
      ...prevSong,
      title: updatedTitle,
    }));
  };
  const newSongTitleRef = useRef(null);

  const handleAddSongClick = () => {
    setAddingSong(true);
    setTimeout(() => {
      if (newSongTitleRef.current) {
        newSongTitleRef.current.focus();
        newSongTitleRef.current.select(); // Highlight the full contents
      }
    }, 0); // Timeout ensures the element is visible before focusing
  };
  return (
    <>
      <div className="flex flex-row items-start gap-4 p-4">
        <AlbumCoverEditor album={album} onUpdateImage={(image)=>{store.updateAlbum({...album, image})}} />
        <div className="flex flex-col gap-4 grow">
          <div className="flex flex-row grow items-center gap-2">
            <EditInPlace value={album.title} onSave={(title)=>updateAlbum({...album, title})} >
              <Heading>{album.title}</Heading>
            </EditInPlace>
          </div>
          <Divider />
          <section className="ml-8" >
            { songs.length > 0 
              ? songs.map((song) => <SongDisplay song={song} key={song.localId || song.id} />)
              :  addingSong || <Text>Add a song to start your album</Text> 
            }
            <div className="flex grow">
              { addingSong 
                  ? <div className="grow">
                      <Input className="grow p-2" value={newAlbumSong.title} onChange={handleTitleChange} ref={newSongTitleRef}/>
                      <div className="flex flex-row gap-2 items-center justify-end">
                        <BadgeButton color="red" onClick={()=>setAddingSong(false)} >Cancel</BadgeButton>
                        <BadgeButton color="blue" onClick={()=>addSongToAlbum({song: newAlbumSong, album})} >Save</BadgeButton>
                        <BadgeButton color="emerald" onClick={()=>setAddingSong(false)} >Start Writing</BadgeButton>
                      </div>
                    </div>
                  : <div className="flex grow justify-end py-2">
                      <BadgeButton color="emerald" onClick={handleAddSongClick} >Add Song +</BadgeButton>
                    </div>
              }
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

const SongDisplay = ({ song } ) => (
  <div className="grow">
    <Link href={`/song/${song.id || song.localId}`} className="flex p-2 flex-row items-center">
      <div className="grow"> {song.title} </div>
      <Badge>{song.status}</Badge>
    </Link>
    <Divider />
  </div>
)

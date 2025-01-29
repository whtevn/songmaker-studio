import { useState, useRef } from 'react'
import { STATUS_SET, WRITING } from '~/models/Constants';
import { Song } from "~/models/Song"
import DashboardSection from "~/components/common/cardSection";
import AlbumCoverEditor from "~/components/common/albumCoverEditor";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Listbox, ListboxOption, ListboxLabel   } from "~/components/catalyst-theme/listbox";
import { Link } from "~/components/catalyst-theme/link";
import { Text } from "~/components/catalyst-theme/text";
import { Input } from "~/components/catalyst-theme/input";
import { Heading } from "~/components/catalyst-theme/heading";
import { Divider } from "~/components/catalyst-theme/divider";
import { Badge, BadgeButton } from "~/components/catalyst-theme/badge";
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/16/solid';
import { useNavigate } from "react-router";
import EditInPlace from "~/components/common/editInPlace";
import useCatalogStore from "~/stores/useCatalogStore";

export default function AlbumSection({onAdd, handleCreateSong}){
  const albums = useCatalogStore(state => state.albums || []);
  return (
    <DashboardSection
      title="Albums" 
    >
{/* onAction={onAdd} actionButton={<PlusCircleIcon className="h-4 w-4" />} */}
      {albums.map((album) => (
        <AlbumSongSection
          handleCreateSong={handleCreateSong}
          album={album}
          key={album.localId || album.id}
        />
      ))}
    </DashboardSection>
  )
}

const AlbumSongSection = ({ album, handleCreateSong }) => {
  const navigate = useNavigate();
  const { getSongsForAlbum, updateAlbum } = useCatalogStore.getState();
  const [ addingSong, setAddingSong ] = useState(false)
  const [ song, setSong ] = useState(new Song())
  const songs = getSongsForAlbum(album)
  const onAddSongToAlbum = (opts={}) => {
    const {navigateTo} = opts
    handleCreateSong(song)
    if(navigateTo){
      setAddingSong(false)
      navigate(`/song/${song.localId}`)
    }else{
      setAddingSong(false)
      setSong(new Song())
    }
  }
  const handleTitleChange = (e) => {
    const updatedTitle = e.target.value;
    setSong((prevSong) => ({
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
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4">
        <div className="w-full sm:w-auto pb-4 sm:pb-2 flex justify-start flex-row">
          <AlbumCoverEditor album={album} onUpdateImage={(image)=>{updateAlbum({...album, image})}} />
        </div>
        <div className="w-full sm:w-auto flex flex-col gap-4 grow">
          <div className="flex flex-row grow items-center gap-2">
            <EditInPlace value={album.title} onSave={(title)=>updateAlbum({...album, title})} >
              <Heading>{album.title}</Heading>
            </EditInPlace>
          </div>
          <Divider />
          <section className="ml-0 sm:ml-8" >
            { songs.length > 0 
              ? songs.map((song) => <SongDisplay song={song} key={song.localId || song.id} />)
              :  addingSong || <Text className="text-center sm:text-left">Add a song to start your album</Text> 
            }
            <div className="flex grow">
              { addingSong 
                  ? <div className="grow">
                      <Input className="grow p-2" value={song.title} onChange={handleTitleChange} ref={newSongTitleRef}/>
                      <div className="flex flex-row gap-2 items-center justify-end">
                        <BadgeButton color="red" onClick={()=>setAddingSong(false)} >Cancel</BadgeButton>
                        <BadgeButton color="blue" onClick={()=>onAddSongToAlbum()} >Save</BadgeButton>
                        <BadgeButton color="emerald" onClick={()=>{
                          onAddSongToAlbum({navigateTo: true})
                        }} >Start Writing</BadgeButton>
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

import { useState } from "react";
import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Text } from "~/components/catalyst-theme/text";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { Song } from '~/stores/SongObject';
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useNavigate } from "react-router";

export default function SongPromptSection({onEdit, onAdd, prompts, album, store}){
  const [ isDeleting, setIsDeleting ] = useState(null)
  const navigate = useNavigate();
  const deletePrompt = (prompt) => {
    store.deletePrompt(prompt)
  }
  const addSongToAlbum = (prompt) => {
    const lyrics = prompt.lines;
    const title = lyrics.split("\n")[0];
    const song = new Song({lyrics, title})
    store.addSong(song)
    store.addSongToAlbum({album, song})
    store.deletePrompt(prompt)
    navigate(`/song/${song.localId}`)
  }
  return (
    <DashboardSection
      title="Song Prompts"
      onAction={onAdd}
      actionButton={<PlusCircleIcon className="h-4 w-4" />}
    >
      {prompts.length > 0
        ? prompts.map((songPrompt, i) => (
          <div className={`flex flex-row items-center justify-between ${ i % 2 ?  "bg-zinc-900" : "" } p-2`} key={songPrompt.localId || songPrompt.id}>
            <Text className="grow cursor-pointer" onClick={()=>onEdit(songPrompt)}>{songPrompt.lines}</Text>

            { isDeleting && isDeleting.id === songPrompt.id && isDeleting.localId === songPrompt.localId 
              ? (
            <span className="flex flex-row gap-2">
              <Text>Are you sure?</Text>
              <BadgeButton color="blue" onClick={()=>setIsDeleting(null)}>
                Cancel
              </BadgeButton>
              <BadgeButton color="red" onClick={()=>deletePrompt(songPrompt)}>
                Delete 
              </BadgeButton>
            </span>
              ) : (
            <span>
              <BadgeButton color="red" onClick={()=>setIsDeleting(songPrompt)}>
                Delete 
              </BadgeButton>
              <BadgeButton color="blue" onClick={()=>addSongToAlbum(songPrompt)}>
                Start Song
              </BadgeButton>
            </span>
              )
            }
          </div>
        ))
        : <Text>
            Add a song prompt here. If you have an idea for a song, or an idea for an idea for a song,
            jot it down here and get to it later. 
        </Text>
      }
      </DashboardSection>
  )
}

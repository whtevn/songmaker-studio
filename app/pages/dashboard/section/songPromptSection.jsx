import { useState } from "react";
import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Text } from "~/components/catalyst-theme/text";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { Song } from "~/models/Song"
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useNavigate } from "react-router";
import useCatalogStore from "~/stores/useCatalogStore";

export default function SongPromptSection({onEdit, onAdd }){
  const prompts = useCatalogStore(state => state.songPrompts);
  const { addSong, addSongToAlbum, deletePrompt } = useCatalogStore.getState()
  const navigate = useNavigate();
  const onAddSongToAlbum = (prompt) => {
    const lyrics = prompt.lines;
    const title = lyrics.split("\n")[0];
    const song = new Song({lyrics, title})
    addSong(song)
    addSongToAlbum({album, song})
    deletePrompt(prompt)
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

            <span>
              <BadgeButton color="blue" onClick={()=>onAddSongToAlbum(songPrompt)}>
                Start Song
              </BadgeButton>
            </span>
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

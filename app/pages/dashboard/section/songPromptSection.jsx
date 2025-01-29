import { useState } from "react";
import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Text } from "~/components/catalyst-theme/text";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { Song } from "~/models/Song"
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useNavigate } from "react-router";
import useCatalogStore from "~/stores/useCatalogStore";

export default function SongPromptSection({ onEdit, onAdd, albumId, handleCreateSong }){
  const prompts = useCatalogStore(state => state.songPrompts);
  const { addSong, addSongToAlbum, deleteSongPrompt, getAlbum } = useCatalogStore.getState()
  const album = getAlbum({localId: albumId})
  const navigate = useNavigate();
  const onAddSongToAlbum = (prompt) => {
    const lyrics = prompt.text;
    const title = lyrics.split("\n")[0];
    const song = new Song({lyrics, title})
    handleCreateSong(song)
    deleteSongPrompt(prompt)
    navigate(`/song/${song.localId}`)
  }
  return (
    <DashboardSection
      title="Song Prompts"
      onAction={onAdd}
      actionButton={<PlusCircleIcon className="h-4 w-4" />}
    >
      {prompts?.length > 0
        ? prompts.map((songPrompt, i) => (
          <div className={`flex flex-row items-center justify-between ${ i % 2 ?  "bg-zinc-900" : "" } p-2`} key={songPrompt.localId || songPrompt.id}>
            <Text className="grow cursor-pointer" onClick={()=>onEdit(songPrompt)}>{songPrompt.text}</Text>

            <span>
              <BadgeButton color="orange" onClick={()=>onAddSongToAlbum(songPrompt)}>
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

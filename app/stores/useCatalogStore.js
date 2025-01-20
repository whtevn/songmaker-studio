import { create } from "zustand";
import { nanoid } from "nanoid";
import CrudBase from "~/stores/CrudBase"

export const WRITING = "writing"
export const RECORDING = "recording"
export const RECORDED = "recorded"
export const RELEASED = "released"
export const STATUS_SET = [
  WRITING,
  RECORDING,
  RECORDED,
  RELEASED
]
export const newSong = (song={}) => {
  return ({
    title: "Untitled Song",
    status: WRITING,
    ...song,
    localId: nanoid(),
  })
}
export const newAlbum = (album={}) => {
  return ({
    title: "Untitled Album",
    status: WRITING,
    songs: [],
    ...album,
    localId: nanoid(),
  })
}
const useStore = create((set, get) => ({
  ...CrudBase("songs")(set, get),
  ...CrudBase("albums", [newAlbum()])(set, get),
  ...CrudBase("prompts")(set, get),
  getAlbumSongs: (albumId) => {
    const album = get().albums.find((a) => a.localId === albumId);
    if (!album) return [];

    return album.songs.map(({ songId }) => {
      return get().songs.find((song) => song.localId === songId);
    }).filter(Boolean); // Filter out null references
  },
  addSongToAlbum: ({ song, album }) => {
    const state = get();

    // Get current songs in the album or initialize as an empty array
    const currentAlbum = state.albums.find((a) => a.id === album.id || a.localId === album.localId);
    if (!currentAlbum) {
      console.error("Album not found");
      return;
    }

    const updatedSongs = [
      ...(currentAlbum.songs || []), // Ensure songs array exists
      { songId: song.id || song.localId, order: (currentAlbum.songs?.length || 0) }, // Add new song
    ];

    // Update the album with the new songs array
    state.updateAlbum({
      ...currentAlbum,
      songs: updatedSongs,
    });
  },
}));

export default useStore;


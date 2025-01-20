import { create } from "zustand";
import { nanoid } from "nanoid";
import { Song, WRITING } from "~/stores/SongObject";
import CrudBase from "~/stores/CrudBase"
import { persist } from 'zustand/middleware'


export const newAlbum = (album={}) => {
  return ({
    title: "Untitled Album",
    status: WRITING,
    songs: [],
    ...album,
    localId: nanoid(),
  })
}
const useStore = create(persist((set, get) => ({
  ...CrudBase("albums", [newAlbum()])(set, get),
  ...CrudBase("prompts")(set, get),
  songs: [],

  // Add a new song
  addSong: (songData) =>{
    const song = new Song(songData)
    return set((state) => ({
      songs: [...state.songs, song],
    }))
  },

  // Update an existing song
  updateSong: (updatedSong) => {
    const id = updatedSong.id || updatedSong.localId;
    set((state) => ({
      songs: state.songs.map((song) =>
        song.id === id || song.localId === id
          ? { ...song, ...updatedSong }
          : song
      ),
    }));
  },

  // Delete a song
  deleteSong: (id) =>
    set((state) => ({
      songs: state.songs.filter(
        (song) => song.id !== id && song.localId !== id
      ),
    })),
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
})), { name: "artistCatalogStore" });

export default useStore;


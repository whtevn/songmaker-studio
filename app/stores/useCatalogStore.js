import { create } from "zustand";
import { nanoid } from "nanoid";

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
const defaultSongId = nanoid();
const defaultAlbumId = nanoid();
const useStore = create((set, get) => ({
  songs: [ ],
  albums: [{
    localId: defaultAlbumId,
    title: "Untitled Album",
    songs: [ ]
  }],
  lyricFragments: [],

  // Songs CRUD
  addSong: (song) =>
    set((state) => ({
      songs: [...state.songs, { localId: nanoid(), ...song }],
    })),
  updateSong: (updatedSong) => {
    const id = updatedAlbum.id || updatedAlbum.localId
    return set((state) => ({
      songs: state.songs.map((song) =>
        song.id === id || song.localId === id
          ? { ...song, ...updatedSong }
          : song
      ),
    }))
  },
  deleteSong: (id) =>
    set((state) => ({
      songs: state.songs.filter(
        (song) => song.id !== id && song.localId !== id
      ),
    })),

  // Albums CRUD
  addAlbum: (album) =>
    set((state) => ({
      albums: [...state.albums, { ...album, localId: nanoid() }],
    })),
  updateAlbum: (updatedAlbum) => {
    const id = updatedAlbum.id || updatedAlbum.localId
    return set((state) => ({
      albums: state.albums.map((album) =>
        album.id === id || album.localId === id
          ? { ...album, ...updatedAlbum }
          : album
      ),
    }))
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
  deleteAlbum: (id) =>
    set((state) => ({
      albums: state.albums.filter(
        (album) => album.id !== id && album.localId !== id
      ),
    })),
  getAlbumSongs: (albumId) => {
    const album = get().albums.find((a) => a.localId === albumId);
    if (!album) return [];

    return album.songs.map(({ songId }) => {
      return get().songs.find((song) => song.localId === songId);
    }).filter(Boolean); // Filter out null references
  },

  // Lyric Fragments CRUD
  addLyricFragment: (fragment) =>
    set((state) => ({
      lyricFragments: [
        ...state.lyricFragments,
        { ...fragment, localId: nanoid() },
      ],
    })),
  updateLyricFragment: (updatedFragment) => {
    const id = updatedFragment.id || updatedFragment.localId
    return set((state) => ({
      lyricFragments: state.lyricFragments.map((fragment) =>
        fragment.id === id || fragment.localId === id
          ? { ...fragment, ...updatedFragment }
          : fragment
      ),
    }))
  },
  deleteLyricFragment: (id) =>
    set((state) => ({
      lyricFragments: state.lyricFragments.filter(
        (fragment) => fragment.id !== id && fragment.localId !== id
      ),
    })),
}));

export default useStore;


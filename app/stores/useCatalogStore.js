import { create } from "zustand";
import { nanoid } from "nanoid";

const defaultSongId = nanoid();
const defaultAlbumId = nanoid();
const useStore = create((set, get) => ({
  songs: [
    {
      localId: defaultSongId,
      title: "Untitled Song"
    }
  ],
  albums: [{
    localId: defaultAlbumId,
    title: "Untitled Album",
    songs: [
      { order: 0, songId: defaultSongId }
    ]
  }],
  lyricFragments: [],

  // Songs CRUD
  addSong: (song) =>
    set((state) => ({
      songs: [...state.songs, { ...song, localId: nanoid() }],
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


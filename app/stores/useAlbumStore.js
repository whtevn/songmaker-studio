// stores/useAlbumStore.js
import { create } from 'zustand';

const useAlbumStore = create((set) => ({
  album: { title: "", songIds: [] },
  setAlbum: (album) => set({ album }),
  addSongToAlbum: (songId) =>
    set((state) => ({
      album: { ...state.album, songIds: [...state.album.songIds, songId] },
    })),
}));

export default useAlbumStore;


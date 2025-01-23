import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCatalogStore from "~/stores/useCatalogStore";

const useInterfaceStore = create(
  persist(
    (set, get) => ({
      selectedAlbum: getSelectedFirstAlbum(),

      // Function to set a new selected album
      setSelectedAlbum: (albumId) =>
        set(() => ({
          selectedAlbum: albumId,
        })),
    }),
    { name: "interface" } // Persist with this key in localStorage
  )
);

// Helper function to get the first album
function getSelectedFirstAlbum() {
  const catalogStore = useCatalogStore.getState(); // Access the catalog store state
  const firstAlbum = catalogStore.albums?.[0] || null;
  return firstAlbum ? firstAlbum.localId || firstAlbum.id : null; // Return the first album's ID or null
}

export default useInterfaceStore;


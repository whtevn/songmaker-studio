// genericSupabaseModule.js
import { supabase } from "~/utils/supabaseClient";

export default function genericSupabaseModule(definition) {
  const entityType = definition.type;           // e.g. "Song"
  const entityKey = entityType.toLowerCase() + "s"; // e.g. "songs"

  return {
    hooks: ({set, get}) => ({
      add: (...args) => {
          /*
        set((state) => ({
          dirtyObjects: [...new Set([...state.dirtyObjects, [typeof item, item.localId]])],
        }));
        */
        console.log(args)
        const updatedArgs = args.map(item => item.localId 
          ? { ...item, dirty: true }
          : item
        )
        return updatedArgs
      },
      update: (item) => {
        /*
        set((state) => ({
          dirtyObjects: [...new Set([...state.dirtyObjects, item.localId])],
        }));
        */
        const updatedArgs = args.map(item => item.localId 
          ? { ...item, dirty: true }
          : item
        )
        return updatedArgs
      },
    }),
    store: ({set, get}) => ({
      dirtyObjects: [],
      async [`fetch${entityType}s`]() {
        const { data, error } = await supabase
          .from(entityKey)
          .select("*");
        if (error) {
          console.error("Supabase fetch error:", error);
          return;
        }
        set({ [entityKey]: data });
      },

      async [`subscribeTo${entityType}s`]() {
        return supabase
          .from(entityKey)
          .on("INSERT", (payload) => {
            set((state) => ({
              [entityKey]: [...state[entityKey], payload.new],
            }));
          })
          .subscribe();
      },

      // Save a single item
      async [`save${entityType}`](item) {
        const { data, error } = await supabase
          .from(entityKey)
          .upsert(item);
        if (error) console.error("Supabase upsert error:", error);
      },

      // Save multiple items
      async [`save${entityType}s`](items) {
        const { data, error } = await supabase
          .from(entityKey)
          .upsert(items);
        if (error) console.error("Supabase upsert error:", error);
      },

      // Save all dirty items
      async [`saveDirty${entityType}s`]() {
        const allItems = get()[entityKey] || [];
        const dirty = allItems.filter((it) => it.dirty);
        if (!dirty.length) return;

        const { data, error } = await supabase
          .from(entityKey)
          .upsert(dirty);
        if (error) console.error("Supabase upsert error:", error);
        else {
          // Mark them as no longer dirty
          set((state) => {
            const updated = state[entityKey].map((obj) => {
              if (dirty.some((d) => d.localId === obj.localId)) {
                return { ...obj, dirty: false };
              }
              return obj;
            });
            return { [entityKey]: updated };
          });
        }
      },
    }),
  };
}


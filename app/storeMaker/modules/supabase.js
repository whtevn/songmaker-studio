// genericSupabaseModule.js
import { supabase } from "~/utils/supabaseClient";


export default function supabaseModule(definition) {
  const entityType = definition.type;           // e.g. "Song"
  const entityKey = entityType.toLowerCase() + "s"; // e.g. "songs"
  const translate = {
    toDb: (i) => {
      const { dirty, ...cleaned } = i;
      console.log(cleaned)
      return definition.supabase?.toDb 
        ? definition.supabase.toDb(cleaned)
        : cleaned
    },
    fromDb: (i) => {
      const cleaned = {...i, dirty: false};
      return definition.supabase?.fromDb 
        ? definition.supabase.fromDb(cleaned)
        : cleaned
    },
  };

  const limitToDefinition = (instance) => 
    Object.keys(instance)
      .filter(key => key in definition)
      .reduce((acc, key) => {
        acc[key] = instance[key];
        return acc;
      }, {});

  return {
    hooks: ({set, get}) => ({
      add: (...args) => {
        if(!get().dirty) set({ dirty: true })
        const updatedArgs = args.map(item => item.localId 
          ? { ...item, dirty: true }
          : item
        )
        return updatedArgs
      },
      update: (...args) => {
        if(!get().dirty) set({ dirty: true })
        const updatedArgs = args.map(item => item.localId && !item.dirty
            ? { ...item, dirty: true }
            : item
        )
        return updatedArgs
      },
    }),
    store: ({set, get}) => ({
      async [`fetch${entityType}s`]() {
        const { data, error } = await supabase
          .from(entityKey)
          .select("*");
        if (error) {
          return;
        }
        set({ [entityKey]: data.map(fromDb) });
      },

      async [`subscribeTo${entityType}s`]() {
        return supabase
          .from(entityKey)
          .on("INSERT", (payload) => {
            set((state) => ({
              [entityKey]: [...state[entityKey], fromDb(payload.new)],
            }));
          })
          .subscribe();
      },

      // Save a single item
      async [`save${entityType}`](item) {
        const { data, error } = await supabase
          .from(entityKey)
          .upsert(translate.toDb(item));
        if (error) {
          throw(error)
        }

      },

      // Save multiple items
      async [`save${entityType}s`](items) {
        const { data, error } = await supabase
          .from(entityKey)
          .upsert(translate.toDb(items));
        if (error) {
          throw(error)
        }
      },

      async [`getDirty${entityType}s`]() {
        const allItems = get()[entityKey] || [];
        return allItems.filter((it) => it.dirty);
      },

      // Save all dirty items
      async [`saveDirty${entityType}s`]() {
        const allItems = get()[entityKey] || [];
        const dirty = allItems.filter((it) => it.dirty);
        if (!dirty.length) return;

        console.log({dirty, mapped: dirty.map(translate.toDb)})
        const { data, error } = await supabase
          .from(entityKey)
          .upsert(dirty.map(translate.toDb));
        if (error) {
          throw(error)
        }
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

 function generateSupabaseModule(definition) {
  return supabaseModule
}

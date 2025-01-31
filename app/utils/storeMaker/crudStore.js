import { nanoid } from "nanoid";

function lowercaseFirstLetter(val) {
  return String(val).charAt(0).toLowerCase() + String(val).slice(1);
}

function uppercaseFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

/**
 * Creates store methods for a single entity definition:
 * @param {Function} set - Zustand's `set`
 * @param {Function} get - Zustand's `get`
 * @param {Object} entity - An object defining the entity:
 *   {
 *     type: string,
 *     default: object,
 *     has_many: [
 *       { type: string, on: string, orderable?: boolean },
 *       ...
 *     ]
 *   }
 * @returns {Object} Store methods for this entity
 */
export default function crudStore({set, get}, entity = {}) {
  const { type = "entity", default: defaultData = {}, has_many = [], defaultValues = [] } = entity;
  // e.g., type = "song"

  const entityKey = `${lowercaseFirstLetter(type)}s`; // e.g., "songs"
  const objectName = uppercaseFirstLetter(type);       // e.g., "Song"

  // Base store methods
  const storeMethods = {
    // The main array holding all instances of this entity
    [entityKey]: defaultValues,

    // Add a new entity
    [`add${objectName}`]: (item = {}) => {
      // Merge with defaults, generate localId if missing
      const newItem = {
        ...defaultData,
        ...item,
        localId: item.localId || nanoid(),
      };
      set((state) => ({
        [entityKey]: [...state[entityKey], newItem],
      }));
    },

    // Update existing entity by localId
    [`update${objectName}`]: (updatedItem) => {
      set((state) => ({
        [entityKey]: state[entityKey].map((item) =>
          item.localId === updatedItem.localId ? { ...item, ...updatedItem } : item
        ),
      }));
    },

    // Delete an entity by localId
    [`delete${objectName}`]: (obj) => {
      set((state) => ({
        [entityKey]: state[entityKey].filter((item) => item.localId !== obj.localId),
      }));
    },

    // Retrieve a single entity by localId
    [`get${objectName}`]: (obj) => {
      return get()[entityKey].find((item) => item.localId === obj.localId);
    },

    // Retrieve all entities of this type
    [`getAll${objectName}s`]: () => {
      return get()[entityKey];
    },
  };

  // Generate relationship methods for `has_many`
  has_many.forEach(({ type: childType, on, orderable }) => {
    const capitalizedChildType = uppercaseFirstLetter(childType);
    const capitalizedOn = uppercaseFirstLetter(on);

    storeMethods[on] = storeMethods[on] || [];

    // Example: getSongSectionsForSong
    storeMethods[`get${capitalizedOn}For${objectName}`] = (ownerObj) => {
      if (!ownerObj[on]) return [];
      // For each localId link in ownerObj[on], find the matching item in state
      return ownerObj[on]
        .map((link) => get()[on]?.find((child) => child.localId === link.localId))
        .filter(Boolean);
    };

    // Example: addSongSectionToSong
    storeMethods[`add${capitalizedChildType}To${objectName}`] = (ownerObj, childItem) => {
      set((state) => {
        console.log("CALLING WITH", {ownerObj, childItem})
        const owners = state[entityKey];
        const foundOwner = owners.find((item) => item.localId === ownerObj.localId);
        if (!foundOwner) {
          throw new Error(`${objectName} not found.`);
        }

        foundOwner[on] = foundOwner[on] || [];
        // Prepare the new link object
        const newLink = {
          localId: childItem.localId || nanoid(),
          ...(orderable && { order: foundOwner[on].length }),
        };
        // Append
        foundOwner[on].push(newLink);

        // Also place childItem in the global array if it doesn't exist
        state[on] = state[on] || [];
        // If the child's localId doesn't exist, push
        if (!state[on].some((x) => x.localId === childItem.localId)) {
          state[on].push(childItem);
        }

        return {
          [entityKey]: [...owners],
          [on]: [...state[on]],
        };
      });
    };

    // Example: addSongSectionToSongAtIndex
    storeMethods[`add${capitalizedChildType}To${objectName}AtIndex`] = (ownerObj, childItem, index) => {
      set((state) => {
        const owners = state[entityKey];
        const foundOwner = owners.find((item) => item.localId === ownerObj.localId);
        if (!foundOwner) {
          throw new Error(`${objectName} not found.`);
        }

        foundOwner[on] = foundOwner[on] || [];
        const newLink = {
          localId: childItem.localId || nanoid(),
          ...(orderable && { order: index }),
        };

        // Insert at specified index
        foundOwner[on].splice(index, 0, newLink);
        // Reassign order to keep them consistent
        foundOwner[on] = foundOwner[on].map((link, i) => ({ ...link, order: i }));

        // Add childItem if missing
        state[on] = state[on] || [];
        if (!state[on].some((x) => x.localId === childItem.localId)) {
          state[on].push(childItem);
        }

        return {
          [entityKey]: [...owners],
          [on]: [...state[on]],
        };
      });
    };

    // Example: moveSongSectionToIndexOnSong
    storeMethods[`move${capitalizedChildType}ToIndexOn${objectName}`] = (ownerObj, childItem, targetIndex) => {
      set((state) => {
        const owners = state[entityKey];
        const foundOwner = owners.find((item) => item.localId === ownerObj.localId);
        if (!foundOwner) {
          throw new Error(`${objectName} not found.`);
        }

        foundOwner[on] = foundOwner[on] || [];
        const oldIndex = foundOwner[on].findIndex((link) => link.localId === childItem.localId);
        if (oldIndex < 0) {
          throw new Error(`${childType} not found in ${objectName}.`);
        }

        // Remove from old index, insert at new
        const [removed] = foundOwner[on].splice(oldIndex, 1);
        foundOwner[on].splice(targetIndex, 0, removed);

        // Reassign order
        foundOwner[on] = foundOwner[on].map((link, i) => ({ ...link, order: i }));

        return {
          [entityKey]: [...owners],
        };
      });
    };

    // Example: removeSongSectionFromSong
    storeMethods[`remove${capitalizedChildType}From${objectName}`] = (ownerObj, childItem) => {
      set((state) => {
        const owners = state[entityKey];
        const foundOwner = owners.find((item) => item.localId === ownerObj.localId);
        if (!foundOwner) {
          throw new Error(`${objectName} not found.`);
        }

        foundOwner[on] = foundOwner[on]?.filter((link) => link.localId !== childItem.localId);

        return {
          [entityKey]: [...owners],
        };
      });
    };
  });

  return storeMethods;
}


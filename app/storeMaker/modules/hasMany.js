// hasManyModule.js
function uppercaseFirstLetter(val) { return val.charAt(0).toUpperCase() + val.slice(1); }
function lowercaseFirstLetter(val) {
  return val.charAt(0).toLowerCase() + val.slice(1);
}

export default function hasManyModule(definition) {
  const { type = "Entity", has_many = [] } = definition;
  const objectName = uppercaseFirstLetter(type);
  const storeMethods = {};

  // We'll produce store methods for each relationship

  const relationshipStore = ({set, get}) => {
    has_many.forEach(({ type: childType, on, orderable }) => {
      const capitalizedChildType = uppercaseFirstLetter(childType);
      const capitalizedOn = uppercaseFirstLetter(on);
      const entityKey = `${lowercaseFirstLetter(type)}s`; // e.g., "songs"

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
    })
    return storeMethods
  };


  const  store = ({set, get}) => relationshipStore({set, get});
  return {
    hooks: {}, // no hooking stable add/update if you want
    store,
  };
}


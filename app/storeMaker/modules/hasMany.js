// hasManyModule.js
function uppercaseFirstLetter(val) { return val.charAt(0).toUpperCase() + val.slice(1); }
function lowercaseFirstLetter(val) {
  return val.charAt(0).toLowerCase() + val.slice(1);
}

const moduleFunctions = ({set, get}, { type: parentType, entityKey }, {on: childPlural, type: childSingular, orderable}) => ({
  children: [],
  getChildrenForParent: (ownerObj) => {
    if (!ownerObj[childPlural]) return [];
    // For each localId link in ownerObj[on], find the matching item in state
    return ownerObj[childPlural]
      .map((link) => get()[childPlural]?.find((child) => child.localId === link.localId))
      .filter(Boolean);
  },
  addChildToParent: (ownerObj, childItem) => {
    set((state) => {
      const owners = state[entityKey];
      const foundOwner = owners.find((item) => item.localId === ownerObj.localId);
      if (!foundOwner) {
        throw new Error(`${objectName} not found.`);
      }

      foundOwner[childPlural] = foundOwner[childPlural] || [];
      // Prepare the new link object
      const newLink = {
        localId: childItem.localId || nanoid(),
        ...(orderable && { order: foundOwner[childPlural].length }),
      };
      // Append
      foundOwner[childPlural].push(newLink);

      // Also place childItem in the global array if it doesn't exist
      state[childPlural] = state[childPlural] || [];
      // If the child's localId doesn't exist, push
      if (!state[childPlural].some((x) => x.localId === childItem.localId)) {
        state[childPlural].push(childItem);
      }

      return {
        [entityKey]: [...owners],
        [childPlural]: [...state[childPlural]],
      };
    });
  },
  addChildToParentAtIndex: (ownerObj, childItem, index) => {
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
  },
  moveChildToIndexOnParent: (ownerObj, childItem, targetIndex) => {
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
  },
  removeChildFromParent: (ownerObj, childItem) => {
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
  }
})

const moduleActions = ({type: parentType, objectName: capitalizedParentType}, {type: childType, on}) => {

  const capitalizedChildType = uppercaseFirstLetter(childType);
  const capitalizedPluralChildType = uppercaseFirstLetter(on);
  return {
    children: [],
    getChildrenForParent: {
      name: `get${capitalizedPluralChildType}For${capitalizedParentType}`
    },
    addChildToParent: {
      name: `add${capitalizedChildType}To${capitalizedParentType}`,
      hook: "add"
    },
    addChildToParentAtIndex: {
      name: `add${capitalizedChildType}To${capitalizedParentType}AtIndex`,
      hook: "add"
    },
    moveChildToIndexOnParent: {
      name: `move${capitalizedChildType}ToIndexOn${capitalizedParentType}`,
      hook: "update"
    },
    removeChildFromParent: {
      name: `remove${capitalizedChildType}From${capitalizedParentType}`,
      hook: "delete"
    }
  }
}


export default function hasManyModule(definition) {
  const { type = "Entity", has_many = [] } = definition;
  const { objectName } = definition;

  // these maps should be reduces on has_many.keys
  const store = ({set, get}) => Object.keys(has_many).reduce(
    ( store , index) => {
      const relationship = has_many[index]
      const storeBase = moduleFunctions({set, get}, definition, relationship)
      const module = moduleActions(definition, relationship)
      const relationshipStore = Object.keys(module).reduce(
        (store, key) => ({
          ...store,
          [module[key].name]: storeBase[key] 
        }), {}) 
      return {...store, ...relationshipStore}
    }, { }
  )
  const useHooksOn = Object.keys(has_many).reduce(
    ( useHooksOn , index) => {
      const relationship = has_many[index]
      const actions = moduleActions(definition, relationship)
      return Object.keys(actions).reduce((useHooksOn, key) => {
        const definition = actions[key]
        if(!definition.hook) return useHooksOn

        const name = definition.name
        const stackName = definition.hook
        const stack = useHooksOn[stackName]

        return { ...useHooksOn, [`${stackName}`]: [...stack, name] }
      }, useHooksOn)
    }, 
    { add: [], update: [], delete: [] }
  )

  return {
    store,
    useHooksOn,
  };
}


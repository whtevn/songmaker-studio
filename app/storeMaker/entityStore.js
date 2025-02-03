// crudStore.js
import { nanoid } from "nanoid";

function lowercaseFirstLetter(val) {
  return val.charAt(0).toLowerCase() + val.slice(1);
}
function uppercaseFirstLetter(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

/**
 * Creates store methods for a single entity definition:
 * plus merges in any modules' hooks & extra store methods.
 */
export default function crudStore({ set, get }, entity = {}, modules = []) {
  const {
    type = "entity",
    default: defaultData = {},
    defaultValues = [],
  } = entity;
  // Notice we’re no longer reading `has_many` here.

  const entityKey = lowercaseFirstLetter(type) + "s";
  const objectName = uppercaseFirstLetter(type);

  // 1) Base stable CRUD methods (no relationships)
  const storeMethods = {
    [entityKey]: defaultValues,

    [`add${objectName}`]: (item = {}) => {
      const newItem = {
        ...defaultData,
        ...item,
        localId: item.localId || nanoid(),
      };
      set((state) => ({
        [entityKey]: [...state[entityKey], newItem],
      }));
    },

    [`update${objectName}`]: (updatedItem) => {
      set((state) => ({
        [entityKey]: state[entityKey].map((it) =>
          it.localId === updatedItem.localId ? { ...it, ...updatedItem } : it
        ),
      }));
    },

    [`delete${objectName}`]: (obj) => {
      set((state) => ({
        [entityKey]: state[entityKey].filter(
          (it) => it.localId !== obj.localId
        ),
      }));
    },

    [`get${objectName}`]: (obj) => {
      return get()[entityKey].find((it) => it.localId === obj.localId);
    },

    [`getAll${objectName}s`]: () => {
      return get()[entityKey];
    },
  };

  // 2) Integrate each module => hooking stable methods + adding store methods
  let finalStore = { ...storeMethods };

  for (const modFun of modules) {
    const mod = modFun(entity)
    const { hooks, store } = mod || {};

    // (a) If the module has hooks, wrap stable methods
    if (hooks) {
      integrateHooks(finalStore, hooks, type);
    }

    // (b) If the module has new store methods, attach them
    if (store) {
      const moduleStore = store({set, get})
      finalStore = { ...finalStore, ...moduleStore }
    }
  }

  return finalStore;
}

/**
 * Wrap stable methods with "before" logic from the module's hooks
 */
function integrateHooks(finalStore, hooksObject, entityType) {
  const objName = entityType[0].toUpperCase() + entityType.slice(1);

  if (hooksObject.add) {
    const origAdd = finalStore[`add${objName}`];
    finalStore[`add${objName}`] = function (item) {
      hooksObject.add(item);
      return origAdd(item);
    };
  }
  if (hooksObject.update) {
    const origUpdate = finalStore[`update${objName}`];
    finalStore[`update${objName}`] = function (updatedItem) {
      hooksObject.update(updatedItem);
      return origUpdate(updatedItem);
    };
  }
  if (hooksObject.delete) {
    const origDel = finalStore[`delete${objName}`];
    finalStore[`delete${objName}`] = function (obj) {
      hooksObject.delete(obj);
      return origDel(obj);
    };
  }
}


import { nanoid } from "nanoid";

const composeHooks = hooksArray => {
  // If there are no hooks, return an identity function
  if (hooksArray.length === 0) {
    return (...args) => args;
  }

  // Reduce the array of functions into a single composed function.
  return hooksArray.reduce((composed, hook) => {
    return (...args) => hook(composed(...args));
  });
};

const combineUseHooksOn = (hooks1, hooks2) => ({
  add: [...(hooks1.add || []), ...(hooks2.add || [])],
  update: [...(hooks1.update || []), ...(hooks2.update || [])],
  delete: [...(hooks1.delete || []), ...(hooks2.delete || [])]
});

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

  const { entityKey, objectName } = entity

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
  let useHooksOn = {
    add: [`add${objectName}`],
    update: [`update${objectName}`],
    delete: [`delete${objectName}`]
  }
  let hooks = {
    add: [],
    update: [],
    delete: [],
  }

  // need to add hook names from modules first 
  // and then after they have all been gathered
  // integrate hooks at the end
  // integrate hooks should be rewritten to apply
  // the hooks after the modules have been gathered

  for (const modFun of modules) {
    const mod = modFun(entity)
    const { hooks: moduleHooksFun, store, useHooksOn: moduleUseHooksOn } = mod || {};

    if(moduleUseHooksOn){
      useHooksOn = combineUseHooksOn(useHooksOn, moduleUseHooksOn)
    }

    if (moduleHooksFun) {
      const moduleHooks = moduleHooksFun({set, get})
      if(moduleHooks.add){
        hooks.add = [...hooks.add, moduleHooks.add]
      }
      if(moduleHooks.update){
        hooks.update = [...hooks.update, moduleHooks.update]
      }
      if(moduleHooks.delete){
        hooks.delete = [...hooks.delete, moduleHooks.delete]
      }
    }

    // If the module has new store methods, attach them
    if (store) {
      const moduleStore = store({set, get})
      finalStore = { ...finalStore, ...moduleStore }
    }
  }

  
  
  // TODO integrate hooks here, instead of above
  // integrateHooks method needs to be rewritten
  //integrateHooks({get, set}, finalStore, useHooksOn);

  return integrateHooks({useHooksOn, hooks, finalStore});
}

/**
 * Wrap stable methods with "before" logic from the module's hooks
 */

function integrateHooks({ useHooksOn, hooks, finalStore }) {
  // Create a shallow copy so we don't mutate the original finalStore.
  const integratedStore = { ...finalStore };

  // Iterate over each operation type: "add", "update", "delete"
  Object.keys(useHooksOn).forEach((opType) => {
    const hookFn = hooks[opType];
    // Only wrap if a hook function exists.
    if (hookFn.length > 0) {
      // For every store function name in the array for this operation type:
      useHooksOn[opType].forEach((fnName) => {
        // Only wrap if finalStore has a function by that name.
        if (typeof finalStore[fnName] === 'function') {
          // Wrap the function so that the hook runs first.
          const runFun = finalStore[fnName]
          integratedStore[fnName] = function (...args) {
            // Run the hook function first.
            const updatedArgs = hookFn.reduce((composed, hook) => {
              return (...args) => hook(composed(...args));
            });
            // Then run the original store function.
            return runFun(...updatedArgs(...args));
          };
        }
      });
    }
  });

  return integratedStore;
}


// integrateHooks.js

export function integrateHooks(store, hooksObject, entityType) {
  // e.g. entityType = 'Song' => stable methods are addSong, updateSong, deleteSong
  const objectName =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);

  if (hooksObject.add) {
    const originalAdd = store[`add${objectName}`];
    store[`add${objectName}`] = function (item) {
      // 1) module's logic
      hooksObject.add(item);

      // 2) call stable method
      return originalAdd(item);
    };
  }

  if (hooksObject.update) {
    const originalUpdate = store[`update${objectName}`];
    store[`update${objectName}`] = function (item) {
      hooksObject.update(item);
      return originalUpdate(item);
    };
  }

  if (hooksObject.delete) {
    const originalDelete = store[`delete${objectName}`];
    store[`delete${objectName}`] = function (obj) {
      hooksObject.delete(obj);
      return originalDelete(obj);
    };
  }
}


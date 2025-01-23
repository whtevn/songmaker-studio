import { nanoid } from "nanoid";

const capitalizeFirstLetter = (str) => {
  const withoutTrailingS = str.endsWith('s') ? str.slice(0, -1) : str;
  return withoutTrailingS.charAt(0).toUpperCase() + withoutTrailingS.slice(1);
};

const CrudBase = (key, defaultValue=[]) => {
  const capitalizedKey = capitalizeFirstLetter(key);

  return (set, get) => ({
    [`${key}`]: defaultValue,
    [`add${capitalizedKey}`]: (item) =>{
    console.log(key)
      return set((state) => ({
        [key]: [...state[key], { ...item, localId: nanoid()}],
      }))
    },
    [`update${capitalizedKey}`]: (updatedItem) => {
      const id = updatedItem.id || updatedItem.localId;
      return set((state) => ({
        [key]: state[key].map((item) =>
          item.id === id || item.localId === id ? { ...item, ...updatedItem } : item
        ),
      }));
    },
    [`delete${capitalizedKey}`]: (deleteItem) =>
      set((state) => ({
        [key]: state[key].filter((item) => item.id !== deleteItem.id && item.localId !== deleteItem.localId),
      })),
  });
};

export default CrudBase

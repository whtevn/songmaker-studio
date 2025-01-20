import { nanoid } from "nanoid";

const capitalizeFirstLetter = (str) => {
  const withoutTrailingS = str.endsWith('s') ? str.slice(0, -1) : str;
  return withoutTrailingS.charAt(0).toUpperCase() + withoutTrailingS.slice(1);
};

const CrudBase = (key, defaultValue=[]) => {
  const capitalizedKey = capitalizeFirstLetter(key);

  return (set, get) => ({
    [`${key}`]: defaultValue,
    [`add${capitalizedKey}`]: (item) =>
      set((state) => ({
        [key]: [...state[key], { localId: nanoid(), ...item }],
      })),
    [`update${capitalizedKey}`]: (updatedItem) => {
      const id = updatedItem.id || updatedItem.localId;
      return set((state) => ({
        [key]: state[key].map((item) =>
          item.id === id || item.localId === id ? { ...item, ...updatedItem } : item
        ),
      }));
    },
    [`delete${capitalizedKey}`]: (id) =>
      set((state) => ({
        [key]: state[key].filter((item) => item.id !== id && item.localId !== id),
      })),
  });
};

export default CrudBase

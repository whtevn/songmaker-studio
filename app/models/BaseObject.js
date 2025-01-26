import { nanoid } from "nanoid";

function lowercaseFirstLetter(val) {
  return String(val).charAt(0).toLowerCase() + String(val).slice(1);
}

function uppercaseFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export class BaseObject {
  constructor(data = {}) {
    this.localId = nanoid();
    this.id = data.id || null;
  }

  compare(otherObject) {
    if (!otherObject || this.constructor.name !== otherObject.constructor.name) {
      return false;
    }
    return this.id === otherObject.id || this.localId === otherObject.localId;
  }

  static has_many(...relationships) {
    this.relationships = this.relationships || [];
    relationships.forEach((relationship) => this.relationships.push(relationship));
  }

  static toStore(set, get, opts = {}) {
    const key = lowercaseFirstLetter(this.name) + "s"; // e.g., "albums"
    const objectName = this.name; // e.g., "Album"

    const storeMethods = {
      [key]: opts.default || [],

      [`add${objectName}`]: (item) => {
        const newItem = new this(item); // Instantiate the class
        set((state) => ({
          [key]: [...state[key], newItem],
        }));
      },

      [`update${objectName}`]: (updatedItem) => {
        set((state) => ({
          [key]: state[key].map((item) =>
            item.localId === updatedItem.localId ? { ...item, ...updatedItem } : item
          ),
        }));
      },

      [`delete${objectName}`]: (object) => {
        set((state) => ({
          [key]: state[key].filter((item) => item.localId !== object.localId),
        }));
      },

      [`get${objectName}`]: (object) => {
        return get()[key].find((item) => item.localId === object.localId);
      },

      [`getAll${objectName}s`]: () => {
        return get()[key];
      },
    };

    // Add dynamic methods for `has_many` relationships
    // type is singular, on is plural
    (this.relationships || []).forEach(({ type, on, orderable }) => {
      storeMethods[`get${uppercaseFirstLetter(on)}For${objectName}`] = (
        owner
      ) => {
        return (
          owner[on]
            ?.map((link) =>
              get()[on]?.find((relatedItem) => relatedItem.localId === link.localId)
            )
            .filter(Boolean) || []
        );
      };

      storeMethods[`add${uppercaseFirstLetter(type)}To${objectName}`] = (
        owner,
        relatedItem
      ) => {
        set((state) => {
          const ownerList = state[key];
          const foundOwner = ownerList.find((item) => item.localId === owner.localId);
          if (!foundOwner) {
            throw new Error(`${objectName} not found.`);
          }

          foundOwner[on] = foundOwner[on] || [];
          const newItem = { localId: relatedItem.localId, ...(orderable && { order: foundOwner[on].length }) };

          foundOwner[on].push(newItem);

          return {
            [key]: [...ownerList],
            [on]: [...state[on], relatedItem],
          };
        });
      };

      storeMethods[`remove${uppercaseFirstLetter(type)}From${objectName}`] = (
        owner,
        relatedItem
      ) => {
        set((state) => {
          const ownerList = state[key];
          const foundOwner = ownerList.find((item) => item.localId === owner.localId);
          if (!foundOwner) {
            throw new Error(`${objectName} not found.`);
          }

          foundOwner[on] = foundOwner[on]?.filter((rel) => rel.localId !== relatedItem.localId);

          return {
            [key]: [...ownerList],
          };
        });
      };
    });

    return storeMethods;
  }
}


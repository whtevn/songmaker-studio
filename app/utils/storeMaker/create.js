import { nanoid } from "nanoid";
import crudStore from './crudStore';

/**
 * Converts an entity definition into a class with:
 *  - A constructor that merges defaults, ensures required fields, etc.
 *  - A static toStore() method to create store functions in your CRUD system.
 *
 * @param {Object} definition - e.g.:
 * {
 *   type: "SongSection",
 *   default: { songId: undefined, ... },
 *   required: ["songId"]
 * }
 * @returns {Class} A dynamically created class
 */
export default function objectify(definitionArg) {
  const {
    type = "Unnamed",
    default: defaultFields = {},
    required = [],
    has_many = [],
  } = definitionArg;

  return class {
    // Attach the raw definition to the class (for static usage)
    static definition = definitionArg;

    constructor(data = {}) {
      // localId
      this.localId = data.localId || nanoid();

      // Merge defaults
      Object.assign(this, defaultFields, data);

      // Required fields check
      for (const field of required) {
        if (this[field] === undefined) {
          throw new Error(`[${type}] Missing required field: "${field}"`);
        }
      }
    }

    // Static method for hooking into your store
    static toStore({set, get}, ...defaultValues) {
      // Pass the definition into your CRUD store setup
      // This is where you’d integrate the "definition" object.
      // Example:
      return crudStore({set, get}, {...this.definition, defaultValues});
    }
  };
}


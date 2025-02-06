import { nanoid } from "nanoid";
import crudStore from './entityStore';
function lowercaseFirstLetter(val) {
  return val.charAt(0).toLowerCase() + val.slice(1);
}
function uppercaseFirstLetter(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

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
export default function objectFor(definitionArg) {
  const {
    type = "Unnamed",
    default: defaultFields = {},
    required = [],
    has_many = [],
  } = definitionArg;

  return class {
    // Attach the raw definition to the class (for static usage)
    static definition = {
      ...definitionArg,
      entityKey: lowercaseFirstLetter(definitionArg.type) + "s",
      objectName: uppercaseFirstLetter(definitionArg.type)
    };
    static modules = [];

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

    static withModule(moduleDefinition) {
      this.modules.push(moduleDefinition);
      return this;
    }

    // Static method for hooking into your store
    static toStore({set, get}, ...defaultValues) {
      // Pass the definition into your CRUD store setup
      // This is where you’d integrate the "definition" object.
      // Example:
      return crudStore({set, get}, {...this.definition, defaultValues}, this.modules);
    }
  };
}

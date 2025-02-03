/**
 * Creates a merged set of store methods for multiple entities at once.
 * Usage:
 *   storeFor({ set, get }, SongDefinition, AlbumDefinition, SongPromptDefinition, ...)
 *
 * Each entity definition should have:
 * {
 *   type: string,
 *   default: object,
 *   has_many: [ { type: string, on: string, orderable?: boolean }, ... ]
 * }
 */
export default function mergedStore({ set, get }, ...entities) {
  let store = {};

  entities.forEach((entity) => {
    store = {
      ...store,
      ...entity.toStore({set, get}),
    };
  });

  return store;
}


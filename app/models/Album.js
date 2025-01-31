import objectFor from '~/utils/storeMaker/create'
export default objectFor({
  type: "Album",
  default: {
    title: "Untitled Album",
    status: "writing",
    songs: [], // List of { SongId, Order }
    image: null, // Optional album image
  },
  has_many: [
    { type: "song", on: "songs", orderable: true },
  ]
})

import objectFor from '~/utils/storeMaker/create'
export default objectFor({
  type: "Album",
  default: {
    title: "Untitled Album",
    status: "writing",
    image: null, // Optional album image
  },
  has_many: [
    { type: "song", on: "songs", orderable: true },
  ]
})

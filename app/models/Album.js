import objectFor from '~/utils/storeMaker/create'
import supabaseModule from '~/utils/storeMaker/supabase'
import hasManyModule from '~/utils/storeMaker/hasMany'
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
.withModule(supabaseModule)
.withModule(hasManyModule)

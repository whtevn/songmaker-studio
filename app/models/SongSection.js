import objectify from '~/utils/storeMaker/create'
export default objectify({
  type: "SongSection",
  default: {
    songId: undefined,
    type: "Untitled Section",
    measures: 4,
    lyrics: "",
  },
  required: [ "songId" ]
})


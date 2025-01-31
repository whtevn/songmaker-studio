import objectFor from '~/utils/storeMaker/create'
export default objectFor({
  type: "LyricVersion",
  default: {
    songId: null, // Required
    lyrics: "",
    name: "Untitled Version",
    timestamp: ()=>Date.now(),
  }
})

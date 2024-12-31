export const saveAlbum = async (album) => {
  const { error } = await supabase.from("albums").upsert(album);
  if (error) {
    console.error("Error saving album:", error.message);
  } else {
    console.log("Album saved successfully");
  }
};

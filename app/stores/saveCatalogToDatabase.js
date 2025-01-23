import { supabase } from '~/utils/supabaseClient';
const saveToDatabase = async (storeData) => {
  try {
    // Extracting your data
    const { songs, albums, prompts } = storeData;

    // Save songs
    const { data: songData, error: songError } = await supabase
      .from("songs")
      .upsert(songs, { onConflict: "id" });

    if (songError) throw new Error(`Error saving songs: ${songError.message}`);

    // Save albums
    const { data: albumData, error: albumError } = await supabase
      .from("albums")
      .upsert(albums, { onConflict: "id" });

    if (albumError) throw new Error(`Error saving albums: ${albumError.message}`);

    // Save lyric fragments
    const { data: lyricData, error: lyricError } = await supabase
      .from("song_prompts")
      .upsert(prompts, { onConflict: "id" });

    if (lyricError) throw new Error(`Error saving lyric fragments: ${lyricError.message}`);

    return true;
  } catch (error) {
    console.error("Failed to save data:", error);
    return false;
  }
};

export default saveToDatabase 

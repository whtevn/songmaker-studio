import { supabase } from "~/utils/supabaseClient";

export const saveSong = async (song) => {
  const { error } = await supabase.from("songs").upsert(song);
  if (error) {
    console.error("Error saving song:", error.message);
  } else {
    console.log("Song saved successfully");
  }
};

export const saveSongWithSections = async (song, sections) => {
  const { error: songError } = await supabase.from("songs").upsert(song);
  if (songError) {
    console.error("Error saving song:", songError.message);
    return;
  }

  const { error: sectionError } = await supabase
    .from("sections")
    .upsert(sections.map((section) => ({ ...section, song_id: song.id })));
  if (sectionError) {
    console.error("Error saving sections:", sectionError.message);
  } else {
    console.log("Song and sections saved successfully");
  }
};

export const fetchSongs = async () => {
  const { data, error } = await supabase.from("songs").select("*");
  if (error) {
    console.error("Error fetching songs:", error.message);
    return [];
  }
  return data;
};

export const fetchSections = async (songId) => {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("song_id", songId);
  if (error) {
    console.error("Error fetching sections:", error.message);
    return [];
  }
  return data;
};


/* example
    const { song } = useSongStore.getState();
    saveSong(song);
**/

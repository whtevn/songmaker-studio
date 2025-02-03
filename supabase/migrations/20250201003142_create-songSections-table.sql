-- 4. Create the songSections table
CREATE TABLE public.songSections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  localId text NOT NULL,
  songId text NOT NULL,
  type text NOT NULL,
  measures int DEFAULT 4,
  lyrics text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp,
  CONSTRAINT songSections_localid_unique UNIQUE (localId),
  CONSTRAINT song_sections_songid_fkey
    FOREIGN KEY (songId)
    REFERENCES public.songs (localId)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- Create an index on localId in the songSections table
CREATE INDEX IF NOT EXISTS songSections_localid_idx
  ON public.songSections (localId);

-- Auto-update updated_at for songSections
CREATE TRIGGER update_songSections_updated_at
BEFORE UPDATE ON public.songSections
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();


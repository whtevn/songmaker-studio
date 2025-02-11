-- 6. Create the lyricVersions table
CREATE TABLE public.lyricVersions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "localId" char(21) NOT NULL,
  songId text NOT NULL,
  type text NOT NULL,
  measures int,
  lyrics text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp,
  CONSTRAINT lyricVersions_localid_unique UNIQUE ("localId"),
  CONSTRAINT lyric_versions_songid_fkey
    FOREIGN KEY (songId)
    REFERENCES public.songs ("localId")
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- Create an index on localId in the lyricVersions table
CREATE INDEX IF NOT EXISTS lyricVersions_localid_idx
  ON public.lyricVersions ("localId");

-- Auto-update updated_at for lyricVersions
CREATE TRIGGER update_lyricVersions_updated_at
BEFORE UPDATE ON public.lyricVersions
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();


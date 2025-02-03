-- 1. Create the function used for auto-updating updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the songs table
CREATE TABLE public.songs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  localId text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'writing',
  tempo int,
  timeSignature text,
  keyRoot text,
  keyMode text,
  lyrics text,
  lyricVersionTally int NOT NULL DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp,
  CONSTRAINT songs_localid_unique UNIQUE (localId)
);

-- Create an index on localId in the songs table
CREATE INDEX IF NOT EXISTS songs_localid_idx
  ON public.songs (localId);

-- Auto-update updated_at for songs
CREATE TRIGGER update_songs_updated_at
BEFORE UPDATE ON public.songs
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

-- 3. Create the albums table
CREATE TABLE public.albums (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  localId text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'writing',
  image text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp,
  CONSTRAINT albums_localid_unique UNIQUE (localId)
);

-- Create an index on localId in the albums table
CREATE INDEX IF NOT EXISTS albums_localid_idx
  ON public.albums (localId);

-- Auto-update updated_at for albums
CREATE TRIGGER update_albums_updated_at
BEFORE UPDATE ON public.albums
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();


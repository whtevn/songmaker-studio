-- 5. Create the songPrompts table
CREATE TABLE public.songPrompts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  localId text NOT NULL,
  text text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp,
  CONSTRAINT songPrompts_localid_unique UNIQUE (localId)
);

-- Create an index on localId in the songPrompts table
CREATE INDEX IF NOT EXISTS songPrompts_localid_idx
  ON public.songPrompts (localId);

-- Auto-update updated_at for songPrompts
CREATE TRIGGER update_songPrompts_updated_at
BEFORE UPDATE ON public.songPrompts
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();


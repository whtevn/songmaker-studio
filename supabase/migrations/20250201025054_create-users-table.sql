-- 1) Create the users table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,  -- same UUID from auth.users
  fullName text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp
);

-- Add a constraint so that profiles.id references auth.users.id
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;


-- 2) albums: add userId and reference users(id)
ALTER TABLE public.albums
  ADD COLUMN userId uuid;

ALTER TABLE public.albums
  ADD CONSTRAINT albums_userid_fkey
  FOREIGN KEY (userId)
  REFERENCES auth.users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

-- 3) songs: add userId and reference users(id)
ALTER TABLE public.songs
  ADD COLUMN userId uuid;

ALTER TABLE public.songs
  ADD CONSTRAINT songs_userid_fkey
  FOREIGN KEY (userId)
  REFERENCES auth.users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

-- 4) songSections: add userId and reference users(id)
ALTER TABLE public.songSections
  ADD COLUMN userId uuid;

ALTER TABLE public.songSections
  ADD CONSTRAINT song_sections_userid_fkey
  FOREIGN KEY (userId)
  REFERENCES auth.users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

-- 5) songPrompts: add userId and reference users(id)
ALTER TABLE public.songPrompts
  ADD COLUMN userId uuid;

ALTER TABLE public.songPrompts
  ADD CONSTRAINT song_prompts_userid_fkey
  FOREIGN KEY (userId)
  REFERENCES auth.users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

-- 6) lyricVersions: add userId and reference users(id)
ALTER TABLE public.lyricVersions
  ADD COLUMN userId uuid;

ALTER TABLE public.lyricVersions
  ADD CONSTRAINT lyric_versions_userid_fkey
  FOREIGN KEY (userId)
  REFERENCES auth.users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;


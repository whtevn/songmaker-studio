import React, { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogActions,
} from "~/components/catalyst-theme/dialog";
import { Fieldset, Field, Label } from "~/components/catalyst-theme/fieldset";
import { Input } from "~/components/catalyst-theme/input";
import { Button } from "~/components/catalyst-theme/button";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "~/components/catalyst-theme/dropdown";
import { XMarkIcon } from "@heroicons/react/16/solid";
import useCatalogStore from "~/stores/useCatalogStore";
import DragAndDropUploader from "~/components/studio-layout/DragAndDropUploader";

const songStatuses = ["Writing", "Recording", "Recorded", "Released"];

const NewSongDialog = ({ isOpen, onClose, onSave, albums, song }) => {
  const [image, setImage] = useState(song?.image);
  const [title, setTitle] = useState(song?.title || "");
  const [status, setStatus] = useState(song?.status || songStatuses[0]); // Default to first status
  const [selectedAlbum, setSelectedAlbum] = useState(song?.album || "none");
  const [customAlbumName, setCustomAlbumName] = useState("");
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const album = selectedAlbum === "create" ? customAlbumName : selectedAlbum;

    if (selectedAlbum === "create" && !customAlbumName.trim()) {
      setError("Please provide an album name.");
      return;
    }

    onSave({
      title,
      status,
      image,
      album: {
        id: selectedAlbum === "create" ? undefined : selectedAlbum,
        name: customAlbumName || undefined
      }
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogBody className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        <Fieldset className="w-full flex flex-col gap-4">
          <Field className="w-full flex flex-row items-center justify-end">
            <Dropdown>
              <DropdownButton>{status}</DropdownButton>
              <DropdownMenu>
                {songStatuses.map((statusOption) => (
                  <DropdownItem
                    key={statusOption}
                    onClick={() => setStatus(statusOption)}
                  >
                    {statusOption}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Field>
          <Field className="w-full">
            <Label>Song Title</Label>
            <Input
              placeholder="New Song Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field className="w-full">
            <Label>Song Art</Label>
            <DragAndDropUploader onFileChange={setImage} />
          </Field>
          <Field className="w-full flex flex-col">
            <Label>Album</Label>
            {selectedAlbum === "create" ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New Album Name"
                  value={customAlbumName}
                  onChange={(e) => setCustomAlbumName(e.target.value)}
                />
                <button
                  onClick={() => {
                    setSelectedAlbum("none");
                    setCustomAlbumName("");
                  }}
                  className="text-gray-500 hover:text-red-500"
                  aria-label="Cancel custom album"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Dropdown>
                <DropdownButton>
                  {selectedAlbum === "none"
                    ? "None"
                    : albums.find((a) => a.id === selectedAlbum)?.name || "Select an Album"}
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem onClick={() => setSelectedAlbum("none")}>
                    None
                  </DropdownItem>
                  {albums.map((album) => (
                    <DropdownItem
                      key={album.id}
                      onClick={() => setSelectedAlbum(album.id)}
                    >
                      {album.name}
                    </DropdownItem>
                  ))}
                  <DropdownItem onClick={() => setSelectedAlbum("create")}>
                    Create a New Album
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </Field>
        </Fieldset>
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} plain>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-500 text-white">
          Add Song
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSongDialog;


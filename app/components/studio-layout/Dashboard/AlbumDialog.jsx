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
import DragAndDropUploader from "~/components/common/DragAndDropUploader";

const albumStatuses = ["Writing", "Recording", "Recorded", "Released"];

const NewAlbumDialog = ({ isOpen, onClose, onSave, album }) => {
  const [title, setTitle] = useState(album?.title || "");
  const [status, setStatus] = useState(album?.status || albumStatuses[0]);
  const [image, setImage] = useState(album?.image);
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    onSave({
      title,
      status,
      image,
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
                {albumStatuses.map((statusOption) => (
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
            <Label>Album Title</Label>
            <Input
              placeholder="New Album Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field className="w-full">
            <Label>Album Image</Label>
            <DragAndDropUploader defaultFile={image} onFileChange={setImage} />
          </Field>
        </Fieldset>
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} plain>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-500 text-white">
          Add Album
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewAlbumDialog;


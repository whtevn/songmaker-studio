import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "~/components/catalyst-theme/dialog";
import { Field } from "~/components/catalyst-theme/fieldset";
import { Textarea } from "~/components/catalyst-theme/textarea";
import { Button } from "~/components/catalyst-theme/button";
import useCatalogStore from "~/stores/useCatalogStore";

const NewSongDialog = ({ isOpen, onClose, onSave, lyric }) => {
  const [lines, setLines] = useState(lyric ? lyric.lines : "");
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!lines.trim()) {
      setError("Lines is required");
      return;
    }

    onSave({
      id: lyric?.id,
      localId: lyric?.localId,
      lines
    });

    onClose(); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New Lyric Fragment</DialogTitle>
      <DialogBody>
        {error && <p className="text-red-500">{error}</p>}
        <Field>
          <Textarea
            placeholder="Add a song fragment here. These can be used to start a song later"
            value={lines}
            rows={10}
            onChange={(e) => setLines(e.target.value)}
          />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} plain>
          Cancel
        </Button>
        <Button onClick={handleSave}>Add Song</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSongDialog;


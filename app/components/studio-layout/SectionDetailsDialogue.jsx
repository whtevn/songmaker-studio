import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "~/components/catalyst-theme/dialog";
import { Fieldset, Field, Label } from "~/components/catalyst-theme/fieldset";
import { Input } from "~/components/catalyst-theme/input";
import { Textarea } from "~/components/catalyst-theme/textarea";
import { Button } from "~/components/catalyst-theme/button";
import useSongInProgress from "~/stores/useSongInProgress";

const SectionDetailsDialog = ({ isOpen, onClose, section }) => {
  const { updateSection } = useSongInProgress();
  const [localSection, setLocalSection] = useState(section);

  const handleInputChange = (key, value) => {
    const updatedSection = { ...localSection, [key]: value };
    setLocalSection(updatedSection);
    updateSection(updatedSection); // Persist changes to the store
  };

  const handleClose = () => {
    setLocalSection(section); // Reset local changes
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{localSection.type}</DialogTitle>
      <DialogBody>
        <Fieldset>
          <Field>
            <Label>Measures</Label>
            <Input
              value={localSection.measures || ""}
              onChange={(e) => handleInputChange("measures", e.target.value)}
            />
          </Field>
        </Fieldset>
        <Fieldset className="mt-4">
          <Field>
            <Label>Lyrics</Label>
            <Textarea
              value={localSection.lyrics || ""}
              onChange={(e) => handleInputChange("lyrics", e.target.value)}
            />
          </Field>
        </Fieldset>
      </DialogBody>
      <DialogActions>
        <Button onClick={handleClose} plain>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionDetailsDialog;


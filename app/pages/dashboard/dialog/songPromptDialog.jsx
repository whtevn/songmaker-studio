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
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { TrashIcon } from '@heroicons/react/16/solid';

const NewSongDialog = ({ isOpen, onClose, onSave, currentSongPrompt, store }) => {
  const [ isDeleting, setIsDeleting ] = useState(false)
  const [text, setText] = useState(currentSongPrompt ? currentSongPrompt.text : "");
  const [error, setError] = useState(null);

  const deletePrompt = () => {
    store.deletePrompt(currentSongPrompt)
    onClose()
  }

  const handleSave = () => {
    if (!text.trim()) {
      setError("some text is required");
      return;
    }

    onSave({ ...currentSongPrompt, text });

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
            value={text}
            rows={10}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
      </DialogBody>
      <DialogActions className="justify-between items-center">
        { isDeleting
            ? <>
              <span>Are you sure?</span>
              <span className="flex gap-2">
                <BadgeButton onClick={()=>setIsDeleting(false)} color="blue" >
                  Cancel
                </BadgeButton>
                <BadgeButton color="red" onClick={deletePrompt}>Delete</BadgeButton>
              </span>
            </> : <>
              <span>
              { currentSongPrompt && 
              <BadgeButton color="red" className="p-2 cursor-pointer" onClick={()=>setIsDeleting(true)}>
                Delete
              </BadgeButton>
              }
              </span>
              <span className="flex gap-2">
              <BadgeButton onClick={onClose}>
                Cancel
              </BadgeButton>
              <BadgeButton color="blue" onClick={handleSave}>Save</BadgeButton>
              </span>
            </>
        }
      </DialogActions>
    </Dialog>
  );
};

export default NewSongDialog;


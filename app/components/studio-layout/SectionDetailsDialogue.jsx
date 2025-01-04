import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "~/components/catalyst-theme/dialog";
import { Field, Label } from "~/components/catalyst-theme/fieldset";
import { Input } from "~/components/catalyst-theme/input";
import { Button } from "~/components/catalyst-theme/button";
import { supabase } from "~/utils/supabaseClient";

const SectionDetailsDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{ section.type }</DialogTitle>
      <DialogBody>
        { section.lyrics } 
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} plain>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionDetailsDialog

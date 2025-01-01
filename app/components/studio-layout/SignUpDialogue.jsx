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
import { useModal } from '~/context/ModalContext';

export const SignUpDialog = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { openModal } = useModal();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onClose(); // Close the dialog on successful sign-up
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Sign Up</DialogTitle>
      <DialogBody>
        {error && <p className="text-red-500">{error}</p>}
        <Field>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </Field>
        <Field className="mt-4">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </Field>
        <p className="mt-4 text-sm text-blue-500 cursor-pointer" onClick={ () => openModal('signIn') }>
          Already have an account?
        </p>
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} plain>
          Cancel
        </Button>
        <Button onClick={handleSignUp}>Sign Up</Button>
      </DialogActions>
    </Dialog>
  );
};
export default SignUpDialog

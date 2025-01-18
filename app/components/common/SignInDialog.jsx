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

const SignInDialog = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { openModal } = useModal();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onClose(); // Close the dialog on successful sign-in
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Sign In</DialogTitle>
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
        <p className="mt-4 text-sm text-blue-500 cursor-pointer" onClick={ () => openModal('forgotPassword') }>
          Forgot Password?
        </p>
        <p className="mt-4 text-sm text-blue-500 cursor-pointer" onClick={ () => openModal('signUp') }>
          Sign Up
        </p>
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} plain>
          Cancel
        </Button>
        <Button onClick={handleSignIn}>Sign In</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignInDialog

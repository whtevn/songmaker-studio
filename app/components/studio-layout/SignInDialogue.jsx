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

const AuthDialog = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Track whether user is signing up or signing in
  const [error, setError] = useState(null);

  const handleAuth = async () => {
    let response;

    if (isSignUp) {
      response = await supabase.auth.signUp({ email, password });
    } else {
      response = await supabase.auth.signInWithPassword({ email, password });
    }

    const { error } = response;

    if (error) {
      setError(error.message);
    } else {
      onClose(); // Close the dialog on successful login or signup
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
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
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} plain>
          Cancel
        </Button>
        <Button onClick={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <Button
          onClick={() => setIsSignUp((prev) => !prev)}
          plain
          className="ml-auto"
        >
          {isSignUp ? "Already have an account? Sign In" : "Create an account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;


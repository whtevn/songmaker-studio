import React, { useState, useEffect } from 'react';
import { Avatar } from '~/components/catalyst-theme/avatar'
import { Link } from '~/components/catalyst-theme/link'
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu, DropdownButton } from '~/components/catalyst-theme/dropdown'
import { Navbar, NavbarItem, NavbarSpacer } from '~/components/catalyst-theme/navbar'
import {
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid';
import Logo from '~/components/studio-layout/SmsLogo';
import SignInDialog from '~/components/studio-layout/SignInDialogue';
import DefaultIcon from '~/components/studio-layout/DefaultIcon';
import { supabase } from '~/utils/supabaseClient';

export default function SmsNavbar() {
  const [session, setSession] = useState(null);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Check if the user is already signed in
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Cleanup the subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <>
      <Navbar>
        <Link href="/" aria-label="Home">
          <Logo className="size-10 sm:size-8" />
        </Link>
        <NavbarSpacer />
        {session ? (
          <Dropdown>
            <DropdownButton as={NavbarItem} aria-label="Account menu">
              { session.user.email.split("@")[0] }
              {session.user.user_metadata?.avatar_url ? (
                <Avatar src={session.user.user_metadata.avatar_url} square />
              ) : (
                <DefaultIcon />
              )}
            </DropdownButton>
            <DropdownMenu className="min-w-64" anchor="bottom end">
              <DropdownItem href="/my-profile">
                <UserIcon />
                <DropdownLabel>My profile</DropdownLabel>
              </DropdownItem>
              <DropdownItem href="/settings">
                <Cog8ToothIcon />
                <DropdownLabel>Settings</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem href="/privacy-policy">
                <ShieldCheckIcon />
                <DropdownLabel>Privacy policy</DropdownLabel>
              </DropdownItem>
              <DropdownItem href="/share-feedback">
                <LightBulbIcon />
                <DropdownLabel>Share feedback</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={handleSignOut}>
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Sign out</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem onClick={() => setIsSignInDialogOpen(true)}>
            <UserIcon /> Sign In
          </NavbarItem>
        )}
      </Navbar>
      <SignInDialog
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
      />
    </>
  );
}


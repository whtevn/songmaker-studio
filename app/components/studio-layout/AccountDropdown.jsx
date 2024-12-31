import React, { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabaseClient';
import DefaultIcon from '~/components/studio-layout/DefaultIcon';
import {
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
  UserIcon,
} from '@heroicons/react/16/solid';
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu, DropdownButton } from '~/components/catalyst-theme/dropdown'
import { Avatar } from '~/components/catalyst-theme/avatar'
import { useModal } from '~/context/ModalContext';


export default function AccountDropdown({ children }) {
  const [session, setSession] = useState(null);
  const { openModal } = useModal();


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
    <nav>
      {session ? (
        <Dropdown>
          <DropdownButton as="button" aria-label="Account menu">
            <span className="flex min-w-0 items-center gap-3">
              {session.user.user_metadata?.avatar_url ? (
                <Avatar src={session.user.user_metadata.avatar_url} square />
              ) : (
                <DefaultIcon />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{session.user.email.split("@")[0]}</span>
              </span>
            </span>
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom end">
            <DropdownItem href="/settings">
              <Cog8ToothIcon className="w-5 h-5 mr-2" />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleSignOut}>
              <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-2" />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <nav onClick={() => openModal('signIn')}>
          { children }
        </nav>
      )}
    </nav>
  );
}


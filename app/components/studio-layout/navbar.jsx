import React, { useState, useEffect } from 'react';
import { Link } from '~/components/catalyst-theme/link'
import { Avatar } from '~/components/catalyst-theme/avatar'
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu, DropdownButton } from '~/components/catalyst-theme/dropdown'
import { Navbar, NavbarItem, NavbarSpacer } from '~/components/catalyst-theme/navbar'
import Logo from '~/components/studio-layout/SmsLogo';
import AccountDropdown from '~/components/studio-layout/AccountDropdown';
import SignInDialog from '~/components/studio-layout/SignInDialogue';
import {
  UserIcon,
} from '@heroicons/react/16/solid';


export default function SmsNavbar() {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  return (
    <>
      <Navbar>
        <Link href="/" aria-label="Home">
          <Logo className="size-10 sm:size-8" />
        </Link>
        <NavbarSpacer />
          <AccountDropdown as={NavbarItem}>
            <NavbarItem onClick={() => setIsSignInDialogOpen(true)}>
              <UserIcon /> Sign In
            </NavbarItem>
          </AccountDropdown>
      </Navbar>
    </>
  );
}


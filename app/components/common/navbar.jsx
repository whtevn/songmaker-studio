import React, { useState, useEffect } from 'react';
import { Link } from '~/components/catalyst-theme/link'
import { Avatar } from '~/components/catalyst-theme/avatar'
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu, DropdownButton } from '~/components/catalyst-theme/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '~/components/catalyst-theme/navbar'
import Logo from '~/components/common/SmsLogo';
import AccountDropdown from '~/components/common/AccountDropdown';
import {
  UserIcon,
} from '@heroicons/react/16/solid';


export default function SmsNavbar() {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  return (
    <>
      <Navbar>
        <NavbarSection className="invisible collapse md:visible">
          <NavbarItem current={ location.pathname === "/" } href="/">Catalog</NavbarItem>
          <NavbarItem current={ location.pathname === "/song/layout" } href="/song/layout">Write</NavbarItem>
          <NavbarItem current={ location.pathname === "/key/find" } href="/key/find">Find a Key</NavbarItem>
        </NavbarSection>
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


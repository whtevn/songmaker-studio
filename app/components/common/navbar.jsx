import React, { useState, useEffect } from 'react';
import { Button } from '~/components/catalyst-theme/button'
//import { Link } from '~/components/catalyst-theme/link'
import { Link } from 'react-router';
import { Avatar } from '~/components/catalyst-theme/avatar'
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu, DropdownButton } from '~/components/catalyst-theme/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarDivider, NavbarSpacer } from '~/components/catalyst-theme/navbar'
import Logo from '~/components/common/SmsLogo';
import AccountDropdown from '~/components/common/AccountDropdown';
import { useModal } from '~/context/ModalContext';
import {
  UserIcon,
} from '@heroicons/react/16/solid';


export default function SmsNavbar({save}) {
  const { openModal } = useModal();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [ isSaveDisabled, setIsSaveDisabled ] = useState(false);
  return (
    <Navbar>
      <Link to={{ pathname: "/" }} className="min-w-[150px]"><Logo /></Link>
      <NavbarSpacer />
        { false && 
      <Button color={ isSaveDisabled ? "slate" : "pink" } onClick={save}>Save</Button>
        }
        { false && 
      <AccountDropdown as={NavbarItem} className="min-w-[200px]">
        <NavbarItem onClick={() => openModal('signIn')}>
          <UserIcon /> Sign In
        </NavbarItem>
      </AccountDropdown>
        }
    </Navbar>
  );
}


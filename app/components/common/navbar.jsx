import React, { useState, useEffect } from 'react';
import { BadgeButton } from '~/components/catalyst-theme/badge'
//import { Link } from '~/components/catalyst-theme/link'
import { Link } from 'react-router';
import { Avatar } from '~/components/catalyst-theme/avatar'
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu, DropdownButton } from '~/components/catalyst-theme/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarDivider, NavbarSpacer } from '~/components/catalyst-theme/navbar'
import Logo from '~/components/common/SmsLogo';
import AccountDropdown from '~/components/common/AccountDropdown';
import { useModal } from '~/context/ModalContext';
import useCatalogStore from "~/stores/useCatalogStore";
import {
  UserIcon,
} from '@heroicons/react/16/solid';


export default function SmsNavbar({save}) {
  const { openModal } = useModal();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [ isSaveDisabled, setIsSaveDisabled ] = useState(false);
  const { saveAllDirtyObjects } = useCatalogStore();
  const storeIsDirty = useCatalogStore(state => state.dirty);
  return (
    <Navbar>
      <Link to={{ pathname: "/" }} className="min-w-[150px]"><Logo /></Link>
      <NavbarSpacer />
        { false && storeIsDirty && 
      <BadgeButton color={ isSaveDisabled ? "slate" : "pink" } onClick={saveAllDirtyObjects}>Save</BadgeButton>
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


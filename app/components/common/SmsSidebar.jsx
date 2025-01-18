import { Link } from '~/components/catalyst-theme/link'
import { Sidebar, SidebarFooter, SidebarBody, SidebarSection, SidebarItem } from '~/components/catalyst-theme/sidebar'
import AccountDropdown from '~/components/common/AccountDropdown'
import {
  UserIcon,
} from '@heroicons/react/16/solid';
import { useLocation } from "react-router";


function SmsSidebar() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem current={ location.pathname === "/" } href="/">Dashboard</SidebarItem>
          <SidebarItem current={ location.pathname === "/song/layout" } href="/song/layout">Write a Song</SidebarItem>
          <SidebarItem current={ location.pathname === "/key/find" } href="/key/find">Find a Key</SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <AccountDropdown onClick={() => setIsSignInDialogOpen(true)} as={SidebarItem}>
          <SidebarItem>
            <UserIcon /> Sign In
          </SidebarItem>
        </AccountDropdown>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SmsSidebar;

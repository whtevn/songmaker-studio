import { Link } from '~/components/catalyst-theme/link'
import { Sidebar, SidebarFooter, SidebarBody, SidebarSection, SidebarItem } from '~/components/catalyst-theme/sidebar'
import Logo from '~/components/studio-layout/SmsLogo'
import AccountDropdown from '~/components/studio-layout/AccountDropdown'
import {
  UserIcon,
} from '@heroicons/react/16/solid';
import { useLocation } from "react-router";


function SmsSidebar() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarBody>
        <div className="mb-2 flex">
          <Link href="#" aria-label="Home">
            <Logo />
          </Link>
        </div>
        <SidebarSection>
          { /* <SidebarItem current={ location.pathname === "/" } href="/">Dashboard</SidebarItem> */ }
          <SidebarItem current={ location.pathname === "/key/find" } href="/key/find">Find a key</SidebarItem>
          <SidebarItem current={ location.pathname === "/song/layout" } href="/song/layout">Layout your song</SidebarItem>
          <SidebarItem current={ location.pathname === "/song/chart" } href="/song/chart">Chart your song</SidebarItem>
          { /* <SidebarItem current={ location.pathname === "/lyrics/new" } href="/lyrics/new">Write Lyrics</SidebarItem> */ }
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

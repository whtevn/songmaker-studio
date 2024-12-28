import { Link } from '../catalyst-theme/link'
import { Sidebar, SidebarBody, SidebarItem, SidebarSection } from '../catalyst-theme/sidebar'
import Logo from './SmsLogo'

function SmsSidebar() {
  return (
    <Sidebar>
      <SidebarBody>
        <div className="mb-2 flex">
          <Link href="#" aria-label="Home">
            <Logo />
          </Link>
        </div>
        <SidebarSection>
          <SidebarItem href="/">Dashboard</SidebarItem>
          <SidebarItem href="/song/new">Create Song</SidebarItem>
          <SidebarItem href="/lyrics/new">Write Lyrics</SidebarItem>
        </SidebarSection>
      </SidebarBody>
    </Sidebar>
  )
}

export default SmsSidebar;

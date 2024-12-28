import { Navbar } from '../../components/catalyst-theme/navbar'
import { SidebarLayout } from '../../components/catalyst-theme/sidebar-layout'
import SmsSidebar from '../../components/studio-layout/SmsSidebar'

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      sidebar={<SmsSidebar />}
      navbar={<Navbar>{/* Your navbar content */}</Navbar>}
    >
      {children}
    </SidebarLayout>
  );
}

export default Page;

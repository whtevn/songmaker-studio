import Navbar  from '~/components/studio-layout/navbar'
import { SidebarLayout } from '~/components/catalyst-theme/sidebar-layout'
import SmsSidebar from '~/components/studio-layout/SmsSidebar'

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      sidebar={<SmsSidebar />}
      navbar={<Navbar />}
    >
      {children}
    </SidebarLayout>
  );
}

export default Page;

import Navbar  from '~/components/studio-layout/navbar'
import { SidebarLayout } from '~/components/catalyst-theme/sidebar-layout'
import SmsSidebar from '~/components/studio-layout/SmsSidebar'
import SignInDialog from '~/components/studio-layout/SignInDialogue';
import { useModal } from '~/context/ModalContext';


export function Page({ children }: { children: React.ReactNode }) {
  const { activeModal, closeModal } = useModal();

  return (
      <SidebarLayout
        sidebar={<SmsSidebar />}
        navbar={<Navbar />}
      >
        {children}

        {/* Render modals based on activeModal */}
        {activeModal === 'signIn' && <SignInDialog isOpen onClose={closeModal} />}
        {/* Add other modals as needed */}
      </SidebarLayout>
  );
}

export default Page;

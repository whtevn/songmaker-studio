import Navbar  from '~/components/studio-layout/navbar'
import { SidebarLayout } from '~/components/catalyst-theme/sidebar-layout'
import SmsSidebar from '~/components/studio-layout/SmsSidebar'
import SignInDialog from '~/components/studio-layout/SignInDialogue';
import SignUpDialog from '~/components/studio-layout/SignUpDialogue';
import ForgotPasswordDialog from '~/components/studio-layout/ForgotPasswordDialogue';
import SectionDetailsDialog from '~/components/studio-layout/SectionDetailsDialogue';
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
        {activeModal === 'signUp' && <SignUpDialog isOpen onClose={closeModal} />}
        {activeModal === 'forgotPassword' && <ForgotPasswordDialog isOpen onClose={closeModal} />}
        {activeModal === 'showSectionDetails' && <SectionDetailsDialog isOpen onClose={closeModal} />}
        {/* Add other modals as needed */}
      </SidebarLayout>
  );
}

export default Page;

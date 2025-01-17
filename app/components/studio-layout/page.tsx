import Navbar  from '~/components/studio-layout/navbar'
import { StackedLayout } from '~/components/catalyst-theme/stacked-layout'
import Sidebar from '~/components/studio-layout/SmsSidebar'
import SignInDialog from '~/components/studio-layout/SignInDialogue';
import SignUpDialog from '~/components/studio-layout/SignUpDialogue';
import ForgotPasswordDialog from '~/components/studio-layout/ForgotPasswordDialogue';
import SectionDetailsDialog from '~/components/studio-layout/SectionDetailsDialogue';
import { useModal } from '~/context/ModalContext';


export function Page({ children }: { children: React.ReactNode }) {
  const modal = useModal();
  const { activeModal, closeModal, activeModalOptions } = modal

  return (
      <StackedLayout
        navbar={<Navbar />}
        sidebar={<Sidebar />}
      >
        {children}

        {/* Render modals based on activeModal */}
        {activeModal === 'signIn' && <SignInDialog isOpen onClose={closeModal} />}
        {activeModal === 'signUp' && <SignUpDialog isOpen onClose={closeModal} />}
        {activeModal === 'forgotPassword' && <ForgotPasswordDialog isOpen onClose={closeModal} />}
        {activeModal === 'showSectionDetails' && <SectionDetailsDialog isOpen onClose={closeModal} section={activeModalOptions} />}
        {/* Add other modals as needed */}
      </StackedLayout>
  );
}

export default Page;

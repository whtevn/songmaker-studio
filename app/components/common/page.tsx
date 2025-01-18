import Navbar  from '~/components/common/navbar'
import { StackedLayout } from '~/components/catalyst-theme/stacked-layout'
import Sidebar from '~/components/common/SmsSidebar'
import SignInDialog from '~/components/common/SignInDialog';
import SignUpDialog from '~/components/common/SignUpDialog';
import ForgotPasswordDialog from '~/components/common/ForgotPasswordDialog';
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
        {/* Add other modals as needed */}
      </StackedLayout>
  );
}

export default Page;

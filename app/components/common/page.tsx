import Navbar  from '~/components/common/navbar'
import { StackedLayout } from '~/components/catalyst-theme/stacked-layout'
import SignInDialog from '~/components/common/SignInDialog';
import SignUpDialog from '~/components/common/SignUpDialog';
import ForgotPasswordDialog from '~/components/common/ForgotPasswordDialog';
import { useModal } from '~/context/ModalContext';


export function Page({ children }: { children: React.ReactNode }) {
  const modal = useModal();
  const { activeModal, closeModal, activeModalOptions } = modal

  return (
      <div className="p-4">
        <Navbar />
        <div className="w-full max-w-[950px] mx-auto">
          {children}
        </div>

        {/* Render modals based on activeModal */}
        {activeModal === 'signIn' && <SignInDialog isOpen onClose={closeModal} />}
        {activeModal === 'signUp' && <SignUpDialog isOpen onClose={closeModal} />}
        {activeModal === 'forgotPassword' && <ForgotPasswordDialog isOpen onClose={closeModal} />}
        {/* Add other modals as needed */}
      </div>
  );
}

export default Page;

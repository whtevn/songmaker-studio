// context/ModalContext.tsx
import React, { createContext, useContext, useState } from 'react';

type ModalType = 'signIn' | 'anotherModal' | null;


const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeModalOptions, setActiveModalOptions] = useState<ModalType>(null);

const openModal = (modal, options = {}) => {
  setActiveModal(modal);
  setActiveModalOptions(options);

  // Apply scroll locking and scrollbar adjustment
  document.body.style.overflow = "hidden";

  // Adjust for scrollbar width to prevent layout shift
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
};

const closeModal = () => {
  setActiveModal(null);
  setActiveModalOptions(null);

  // Remove scroll locking and reset padding
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};


  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal, activeModalOptions }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};


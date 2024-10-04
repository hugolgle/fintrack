import React, { useContext } from "react";
import { ModalContext } from "../context/ModalContext";

const Modal = ({ children }) => {
  const { isModalOpen, closeModal } = useContext(ModalContext);

  if (!isModalOpen) return null; // Ne rien afficher si le modal est fermé

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className="rounded-2xl animate__animated animate__zoomIn bg-colorPrimaryLight dark:bg-colorSecondaryDark shadow-2xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

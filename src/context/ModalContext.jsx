import React, { createContext, useState } from "react";

// Créer le contexte pour le modal
export const ModalContext = createContext();

// Créer le fournisseur de contexte (provider)
export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ouvrir le modal
  const openModal = () => setIsModalOpen(true);

  // Fermer le modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

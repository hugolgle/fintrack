// src/context/MessageContext.tsx
import React, { createContext, useState, ReactNode, ReactElement } from "react";
import CardMessage from "../composant/cardMessage";

// Définir un type pour le contexte
interface MessageContextType {
  showMessage: (msg: string, color: string) => void;
}

// Créer le contexte avec une valeur par défaut
export const MessageContext = createContext<MessageContextType | undefined>(
  undefined
);

// Définir le type des props du provider
interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}): ReactElement => {
  const [message, setMessage] = useState<string | null>(null);
  const [color, setColor] = useState<string>("red");

  const showMessage = (msg: string, color: string) => {
    setMessage(msg);
    setColor(color);
    setTimeout(() => {
      setMessage(null);
    }, 11000);
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {message && <CardMessage message={message} color={color} />}
    </MessageContext.Provider>
  );
};

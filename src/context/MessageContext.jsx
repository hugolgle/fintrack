// src/context/MessageContext.tsx
import React, { createContext, useState, ReactNode, ReactElement } from "react";
import CardMessage from "../composant/cardMessage";

// Créer le contexte avec une valeur par défaut
export const MessageContext = createContext(undefined);

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("red");

  const showMessage = (msg, color) => {
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

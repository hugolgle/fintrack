import { createContext, useContext, useState } from "react";

const AmountVisibilityContext = createContext();

export const AmountVisibilityProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <AmountVisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </AmountVisibilityContext.Provider>
  );
};

export const useAmountVisibility = () => useContext(AmountVisibilityContext);

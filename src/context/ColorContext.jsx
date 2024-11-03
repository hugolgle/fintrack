import React, { createContext, useContext, useState, useEffect } from "react";

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  // États pour chaque couleur
  const [colorPrimaryCustom, setColorPrimaryCustom] = useState("#ababab");
  const [colorSecondaryCustom, setColorSecondaryCustom] = useState("#9c9c9c");
  const [colorBackGroundCustom, setColorBackGroundCustom] = useState("#878787");
  const [colorTextCustom, setColorTextCustom] = useState("#000000");

  // Charger les couleurs sauvegardées
  useEffect(() => {
    const savedPrimaryCustom =
      localStorage.getItem("colorPrimaryCustom") || colorPrimaryCustom;
    const savedSecondaryCustom =
      localStorage.getItem("colorSecondaryCustom") || colorSecondaryCustom;
    const savedBackGroundCustom =
      localStorage.getItem("colorBackGroundCustom") || colorBackGroundCustom;
    const savedTextCustom =
      localStorage.getItem("colorTextCustom") || colorTextCustom; // Charger la couleur du texte

    setColorPrimaryCustom(savedPrimaryCustom);
    setColorSecondaryCustom(savedSecondaryCustom);
    setColorBackGroundCustom(savedBackGroundCustom);
    setColorTextCustom(savedTextCustom); // Mettre à jour la couleur du texte

    applyColors(
      savedPrimaryCustom,
      savedSecondaryCustom,
      savedBackGroundCustom,
      savedTextCustom
    );
  }, []);

  // Appliquer les couleurs dans le document
  const applyColors = (
    primaryCustom,
    secondaryCustom,
    backGroundCustom,
    textCustom
  ) => {
    document.documentElement.style.setProperty(
      "--color-primary-custom",
      primaryCustom
    );
    document.documentElement.style.setProperty(
      "--color-secondary-custom",
      secondaryCustom
    );
    document.documentElement.style.setProperty(
      "--color-backGround-custom",
      backGroundCustom
    );
    document.documentElement.style.setProperty(
      "--color-text-custom",
      textCustom
    ); // Appliquer la couleur du texte
  };

  // Sauvegarder et appliquer les nouvelles couleurs
  const handleColorChange = () => {
    localStorage.setItem("colorPrimaryCustom", colorPrimaryCustom);
    localStorage.setItem("colorSecondaryCustom", colorSecondaryCustom);
    localStorage.setItem("colorBackGroundCustom", colorBackGroundCustom);
    localStorage.setItem("colorTextCustom", colorTextCustom); // Sauvegarder la couleur du texte

    applyColors(
      colorPrimaryCustom,
      colorSecondaryCustom,
      colorBackGroundCustom,
      colorTextCustom
    );
  };

  return (
    <ColorContext.Provider
      value={{
        colorPrimaryCustom,
        setColorPrimaryCustom,
        colorSecondaryCustom,
        setColorSecondaryCustom,
        colorBackGroundCustom,
        setColorBackGroundCustom, // Correction : ajout de la fonction de mise à jour
        colorTextCustom,
        setColorTextCustom, // Ajout de la fonction pour la couleur du texte
        handleColorChange,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);

import { useState, useEffect } from "react";
import Header from "../../composant/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "../../context/ThemeContext";

export default function Branding() {
  const [colorPrimaryCustom, setColorPrimaryCustom] = useState("#ababab");
  const [colorSecondaryCustom, setColorSecondaryCustom] = useState("#9c9c9c");
  const [colorBackGroundCustom, setColorBackGroundCustom] = useState("#878787");
  const [colorTextCustom, setColorTextCustom] = useState("#000000");

  useEffect(() => {
    const savedPrimaryCustom =
      localStorage.getItem("colorPrimaryCustom") || colorPrimaryCustom;
    const savedSecondaryCustom =
      localStorage.getItem("colorSecondaryCustom") || colorSecondaryCustom;
    const savedBackgroundCustom =
      localStorage.getItem("colorBackGroundCustom") || colorBackGroundCustom;
    const savedTextCustom =
      localStorage.getItem("colorTextCustom") || colorTextCustom;

    setColorPrimaryCustom(savedPrimaryCustom);
    setColorSecondaryCustom(savedSecondaryCustom);
    setColorBackGroundCustom(savedBackgroundCustom);
    setColorTextCustom(savedTextCustom);

    applyColors(
      savedPrimaryCustom,
      savedSecondaryCustom,
      savedBackgroundCustom,
      savedTextCustom
    );
  }, []);

  const applyColors = (primary, secondary, background, text) => {
    document.documentElement.style.setProperty(
      "--color-primary-custom",
      primary
    );
    document.documentElement.style.setProperty(
      "--color-secondary-custom",
      secondary
    );
    document.documentElement.style.setProperty(
      "--color-backGround-custom",
      background
    );
    document.documentElement.style.setProperty("--color-text-custom", text);
  };

  const handleColorChange = () => {
    localStorage.setItem("colorPrimaryCustom", colorPrimaryCustom);
    localStorage.setItem("colorSecondaryCustom", colorSecondaryCustom);
    localStorage.setItem("colorBackGroundCustom", colorBackGroundCustom);
    localStorage.setItem("colorTextCustom", colorTextCustom);

    applyColors(
      colorPrimaryCustom,
      colorSecondaryCustom,
      colorBackGroundCustom,
      colorTextCustom
    );

    toast.success("Couleurs mises à jour !");
  };

  // Réinitialiser les couleurs aux valeurs par défaut
  const handleResetColors = () => {
    const defaultPrimaryCustom = "#ababab";
    const defaultSecondaryCustom = "#9c9c9c";
    const defaultBackGroundCustom = "#878787";
    const defaultTextCustom = "#000000";

    setColorPrimaryCustom(defaultPrimaryCustom);
    setColorSecondaryCustom(defaultSecondaryCustom);
    setColorBackGroundCustom(defaultBackGroundCustom);
    setColorTextCustom(defaultTextCustom);

    localStorage.setItem("colorPrimaryCustom", defaultPrimaryCustom);
    localStorage.setItem("colorSecondaryCustom", defaultSecondaryCustom);
    localStorage.setItem("colorBackGroundCustom", defaultBackGroundCustom);
    localStorage.setItem("colorTextCustom", defaultTextCustom);

    applyColors(
      defaultPrimaryCustom,
      defaultSecondaryCustom,
      defaultBackGroundCustom,
      defaultTextCustom
    );
  };

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  return (
    <section className="w-full">
      <Header title="Marque" />

      <div className={`space-y-4 p-4 rounded-2xl w-1/4 mx-auto ${bgColor}`}>
        <div>
          <label className="block font-medium mb-1">Couleur primaire</label>
          <Input
            type="color"
            value={colorPrimaryCustom}
            onChange={(e) => setColorPrimaryCustom(e.target.value)}
            className="w-full border rounded-md p-1"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Couleur secondaire</label>
          <Input
            type="color"
            value={colorSecondaryCustom}
            onChange={(e) => setColorSecondaryCustom(e.target.value)}
            className="w-full border rounded-md p-1"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Couleur de fond</label>
          <Input
            type="color"
            value={colorBackGroundCustom}
            onChange={(e) => setColorBackGroundCustom(e.target.value)}
            className="w-full border rounded-md p-1"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Couleur du texte</label>
          <Input
            type="color"
            value={colorTextCustom}
            onChange={(e) => setColorTextCustom(e.target.value)}
            className="w-full border rounded-md p-1"
          />
        </div>

        <Button onClick={handleColorChange}>Appliquer les couleurs</Button>
        <Button onClick={handleResetColors} variant="outline">
          Réinitialiser les couleurs
        </Button>
      </div>
    </section>
  );
}

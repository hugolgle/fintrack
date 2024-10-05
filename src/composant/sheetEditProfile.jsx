import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useState } from "react";
import { useDispatch } from "react-redux"; // Importez useDispatch pour les actions Redux
import { toast } from "sonner";
import { editUser } from "../redux/actions/user.action";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { getTransactions } from "../redux/actions/transaction.action";
import { getInvestments } from "../redux/actions/investment.action";

export function SheetEditProfile({ btnOpen, dataProfil }) {
  const dispatch = useDispatch(); // Initialize dispatch for Redux actions
  const [prenom, setPrenom] = useState(dataProfil?.prenom ?? "");
  const [nom, setNom] = useState(dataProfil?.nom ?? "");
  const [username, setUsername] = useState(dataProfil?.username ?? "");
  const [pseudo, setPseudo] = useState(dataProfil?.pseudo ?? "");
  const [selectedFile, setSelectedFile] = useState(dataProfil?.img ?? ""); // Start with no file selected
  const [preview, setPreview] = useState(null); // State for image preview
  const [isImageDeleted, setIsImageDeleted] = useState(false); // Track image deletion
  const [hiddenImg, setHiddenImg] = useState(false); // Track image deletion
  const [isOpen, setIsOpen] = useState(false);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);

  const baseUserData = [
    dataProfil?.prenom,
    dataProfil?.nom,
    dataProfil?.username,
    dataProfil?.pseudo,
    dataProfil?.img,
  ];

  const modifiedUserData = [prenom, nom, username, pseudo, selectedFile];

  const isSaveDisabled = baseUserData.every(
    (value, index) => value === modifiedUserData[index]
  );

  useEffect(() => {
    // Vérifie si au moins un champ est vide
    if (prenom === "" || nom === "" || username === "" || pseudo === "") {
      setIsFieldEmpty(true);
    } else {
      setIsFieldEmpty(false);
    }
  }, [prenom, nom, username, pseudo]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a URL for the image preview
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setIsImageDeleted(false); // Reset deletion state when a new file is selected
    }
  };

  // Handle image deletion
  const handleImageDelete = () => {
    setIsImageDeleted(true); // Mark the image as deleted
    setSelectedFile(null); // Clear the selected file
    setPreview(null);
    setHiddenImg(true);
  };

  const handleUpdateConfirmation = async (e) => {
    e.preventDefault();

    // Fonction pour valider le format de l'email

    const formData = new FormData();
    formData.append("_id", dataProfil?.id);
    formData.append("username", username);
    formData.append("pseudo", pseudo);
    formData.append("nom", nom);
    formData.append("prenom", prenom);

    // If the image is deleted, indicate this in the formData
    if (isImageDeleted) {
      formData.append("img", null); // Indicate that the image should be deleted
    } else if (selectedFile) {
      formData.append("img", selectedFile); // Add the selected file
    }

    try {
      const successMessage = await dispatch(editUser(formData));
      if (successMessage) {
        toast.success(successMessage); // Affichez le message de succès du backend
        setIsOpen(false);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message); // Affichez le message d'erreur du backend
      } else {
        toast.error("Une erreur s'est produite lors de la modification !");
      }
      setIsOpen(true);
    }
  };

  // Reset function to cancel modifications
  const handleCancel = () => {
    setPrenom(dataProfil?.prenom ?? "");
    setNom(dataProfil?.nom ?? "");
    setUsername(dataProfil?.username ?? "");
    setPseudo(dataProfil?.pseudo ?? "");
    setSelectedFile(dataProfil?.img ?? "");
    setPreview(null);
    setIsImageDeleted(false);
    setHiddenImg(false);
  };

  const handleSheetOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      handleCancel();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button variant="none" className="p-0 h-full">
          {btnOpen}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier mon profil</SheetTitle>
          <SheetDescription>
            Apportez des modifications à votre profil ici. Cliquez sur
            enregistrer lorsque vous avez terminé.
          </SheetDescription>
        </SheetHeader>
        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prenom" className="text-right">
              Prénom
            </Label>
            <Input
              id="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom
            </Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              E-mail
            </Label>
            <Input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pseudo" className="text-right">
              Pseudo
            </Label>
            <Input
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Photo de profil
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          <SheetFooter>
            <div className="flex space-x-4">
              {!isSaveDisabled && (
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="animate-fade"
                >
                  Annuler
                </Button>
              )}
              <SheetClose asChild>
                <Button
                  type="button"
                  onClick={handleUpdateConfirmation}
                  disabled={isSaveDisabled || isFieldEmpty}
                >
                  Enregistrer
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </form>
        <div className="relative mx-auto w-fit">
          {dataProfil?.img && !hiddenImg && (
            <Trash2
              className="absolute top-1 right-1 z-50 text-red-600 cursor-pointer transition-all hover:scale-110"
              onClick={handleImageDelete} // Bind click event to delete handler
            />
          )}
          {preview ? (
            <Avatar className="w-32 h-32">
              <AvatarImage className="object-cover" src={preview} />
            </Avatar>
          ) : (
            !hiddenImg && (
              <Avatar className="w-32 h-32">
                <AvatarImage
                  className="object-cover"
                  src={`http://localhost:5001/${dataProfil?.img}`}
                />
              </Avatar>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

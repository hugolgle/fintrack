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

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useEditUser, useCurrentUser } from "../hooks/user.hooks";

export function SheetEditProfile({ btnOpen, dataProfil }) {
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [prenom, setPrenom] = useState(dataProfil?.prenom ?? "");
  const [nom, setNom] = useState(dataProfil?.nom ?? "");
  const [username, setUsername] = useState(dataProfil?.username ?? "");
  const [pseudo, setPseudo] = useState(dataProfil?.pseudo ?? "");
  const [selectedFile, setSelectedFile] = useState(dataProfil?.img ?? "");
  const [preview, setPreview] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [hiddenImg, setHiddenImg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: editUser, isLoading: isEditing } = useEditUser();
  const { refetch: refetchUser } = useCurrentUser();

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
    setIsFieldEmpty(
      prenom === "" || nom === "" || username === "" || pseudo === ""
    );
  }, [prenom, nom, username, pseudo]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setIsImageDeleted(false);
    }
  };

  const handleImageDelete = () => {
    setIsImageDeleted(true);
    setSelectedFile(null);
    setPreview(null);
    setHiddenImg(true);
  };

  const handleUpdateConfirmation = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("pseudo", pseudo);
    formData.append("nom", nom);
    formData.append("prenom", prenom);

    if (!isImageDeleted && selectedFile) {
      formData.append("img", selectedFile);
    }

    if (isSaveDisabled) {
      toast.info("Aucune modification apportée !");
      return;
    }

    try {
      await editUser(formData);
      toast.success("Profil mis à jour avec succès !");
      await refetchUser();
      setIsOpen(false);
    } catch (err) {
      toast.error(
        "Une erreur s'est produite lors de la mise à jour du profil !"
      );
    }
  };

  const handleCancel = () => {
    setPrenom(dataProfil?.prenom ?? "");
    setNom(dataProfil?.nom ?? "");
    setUsername(dataProfil?.username ?? "");
    setPseudo(dataProfil?.pseudo ?? "");
    setSelectedFile(null);
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
              <Button
                type="button"
                onClick={handleUpdateConfirmation}
                disabled={isSaveDisabled || isFieldEmpty || isEditing}
              >
                {isEditing ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </SheetFooter>
        </form>
        <div className="relative rounded-full group mx-auto mt-16 w-fit">
          {dataProfil?.img && !hiddenImg && (
            <Trash2
              size={50}
              strokeWidth={1}
              className="absolute top-1/2 left-1/2 text-white opacity-0 group-hover:opacity-100 z-50 cursor-pointer transition-all hover:scale-110 transform -translate-x-1/2 -translate-y-1/2"
              onClick={handleImageDelete}
            />
          )}
          {preview ? (
            <Avatar className="w-48 h-48">
              <AvatarImage
                className="object-cover animate-fade transition-all duration-300 group-hover:brightness-50"
                src={preview}
              />
            </Avatar>
          ) : (
            !hiddenImg && (
              <Avatar className="w-48 h-48">
                <AvatarImage
                  className="object-cover animate-fade transition-all duration-300 group-hover:brightness-75"
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

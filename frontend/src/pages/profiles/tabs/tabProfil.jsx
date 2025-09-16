import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Container from "../../../components/containers/container.jsx";
import { Button } from "@/components/ui/button";
import { SheetEditProfile } from "../sheetEditProfile.jsx";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInitials } from "../../../utils/users.js";
import { Input } from "@/components/ui/input";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Upload } from "lucide-react";
import { updateImg } from "../../../services/user.service.jsx";
import { useMutation } from "@tanstack/react-query";

function TabProfil({ dataUser, refetch }) {
  const initialName = getInitials(dataUser?.prenom, dataUser?.nom);
  const phone = dataUser?.phone ?? "Aucun téléphone";
  const phoneNumber = phone ? parsePhoneNumberFromString(phone, "FR") : null;
  const formatted = phoneNumber ? phoneNumber.formatInternational() : phone;
  const fileInputRef = useRef(null);
  const isGoogleAccount = !!dataUser?.googleId;

  const [selectedImage, setSelectedImage] = useState(null);

  const formik = {
    initialValues: {
      img: dataUser?.img || null,
    },
    setFieldValue: (field, value) => {
      formik.initialValues[field] = value;
    },
  };

  const mutationUpdateImg = useMutation({
    mutationFn: async ({ id, img }) => {
      return await updateImg(id, img);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("imgProfile", selectedImage);
    mutationUpdateImg.mutate({ id: dataUser._id, img: formData });
  };

  const handleDelete = () => {
    mutationUpdateImg.mutate({ id: dataUser._id, img: { img: "" } });
  };

  return (
    <div className="flex flex-col gap-4">
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Informations personnelles
          </CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
              <p>
                {dataUser?.prenom} {dataUser?.nom}
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p>{dataUser?.username}</p>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">
                Téléphone
              </h3>
              <p>{formatted === null ? "Auncun telephone" : formatted}</p>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">
                Adresse
              </h3>
              <p>
                {dataUser?.address
                  ? `${dataUser?.address}, ${dataUser.city} ${dataUser.zipcode}`
                  : "Aucune adresse"}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <SheetEditProfile dataProfil={dataUser} refetch={refetch} />
          </div>
        </div>
      </Container>
      {!isGoogleAccount && (
        <Container>
          <CardHeader className="text-left p-0 pb-10">
            <CardTitle className="text-2xl font-bold">
              Photo de profil
            </CardTitle>
            <CardDescription>Modifiez votre photo de profil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="size-24">
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : dataUser?.img ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${dataUser.img}`}
                  alt="User Avatar"
                  className="object-cover w-full h-full rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <AvatarFallback className="bg-secondary">
                  {initialName}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Changer l'image
              </Button>

              <Button
                variant="outline"
                onClick={handleUpload}
                disabled={!selectedImage || mutationUpdateImg.isLoading}
              >
                Valider
              </Button>

              <Button
                variant="outline"
                className="text-destructive"
                onClick={handleDelete}
                disabled={mutationUpdateImg.isLoading}
              >
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Container>
      )}
    </div>
  );
}

export default TabProfil;

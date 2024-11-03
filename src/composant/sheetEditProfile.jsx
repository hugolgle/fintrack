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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEditUser, useCurrentUser } from "../hooks/user.hooks";

const validationSchema = yup.object({
  prenom: yup.string().required("Prénom est requis"),
  nom: yup.string().required("Nom est requis"),
  username: yup.string().email("Email invalide").required("Email est requis"),
});

export function SheetEditProfile({ btnOpen, dataProfil }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Gérer l'ouverture du Sheet
  const [preview, setPreview] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [hiddenImg, setHiddenImg] = useState(false);
  const { mutate: editUser, isPending } = useEditUser();
  const { refetch: refetchUser } = useCurrentUser();

  const formik = useFormik({
    initialValues: {
      prenom: dataProfil?.prenom || "",
      nom: dataProfil?.nom || "",
      username: dataProfil?.username || "",
      file: dataProfil?.img || null,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("nom", values.nom);
      formData.append("prenom", values.prenom);
      if (!isImageDeleted && values.file) {
        formData.append("img", values.file);
      }
      editUser(formData, {
        onSuccess: async () => {
          await refetchUser(); // Refetch user data on success
          setIsSheetOpen(false); // Close the sheet
        },
      });
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("file", file);
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setIsImageDeleted(false);
    }
  };

  const handleClickTrash = () => {
    formik.setFieldValue("file", null);
    setPreview(null);
    setHiddenImg(true);
  };

  const handleSheetOpenChange = (open) => {
    setIsSheetOpen(open); // Mettre à jour l'état d'ouverture
    if (!open) {
      formik.resetForm(); // Réinitialiser le formulaire à la fermeture
      setPreview(null);
      setIsImageDeleted(false);
      setHiddenImg(false);
    }
  };

  const dataBase = [
    dataProfil?.prenom,
    dataProfil?.nom,
    dataProfil?.username,
    dataProfil?.img || null,
  ];

  const dataEdit = [
    formik.values.prenom,
    formik.values.nom,
    formik.values.username,
    formik.values.file,
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="mt-4 text-xs rounded-xl"
          onClick={() => setIsSheetOpen(true)}
        >
          Modifier
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
        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prenom" className="text-right">
              Prénom
            </Label>
            <Input
              id="prenom"
              name="prenom"
              value={formik.values.prenom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="col-span-3"
              required
            />
            {formik.touched.prenom && formik.errors.prenom && (
              <p className="text-xs text-red-500 mt-1 col-span-4 text-right">
                {formik.errors.prenom}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom
            </Label>
            <Input
              id="nom"
              name="nom"
              value={formik.values.nom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="col-span-3"
              required
            />
            {formik.touched.nom && formik.errors.nom && (
              <p className="text-xs text-red-500 mt-1 col-span-4 text-right">
                {formik.errors.nom}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              E-mail
            </Label>
            <Input
              id="username"
              name="username"
              type="email"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="col-span-3"
              required
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-xs text-red-500 mt-1 col-span-4 text-right">
                {formik.errors.username}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Photo de profil
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          <SheetFooter>
            {!isSaveDisabled && (
              <Button
                type="button"
                onClick={() => {
                  formik.resetForm(), setHiddenImg(false), setPreview(false);
                }}
                variant="outline"
                className="animate-fade"
                disabled={isPending}
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                formik.isSubmitting || !formik.isValid || isSaveDisabled
              }
            >
              {isPending ? "Enregistrement ..." : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
        <div className="relative rounded-full group mx-auto mt-16 w-fit">
          {dataProfil?.img && !hiddenImg && (
            <Trash2
              size={50}
              strokeWidth={1}
              className="absolute top-1/2 left-1/2 text-white opacity-0 group-hover:opacity-100 z-50 cursor-pointer transition-all hover:scale-110 transform -translate-x-1/2 -translate-y-1/2"
              onClick={handleClickTrash}
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

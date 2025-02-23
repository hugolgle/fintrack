import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
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
import { useMutation } from "@tanstack/react-query";
import { editUser } from "../../Service/User.service";
import { getUserIdFromToken } from "../../utils/users";
import ButtonLoading from "../../composant/Button/ButtonLoading";

const validationSchema = yup.object({
  prenom: yup.string().required("Prénom est requis"),
  nom: yup.string().required("Nom est requis"),
  username: yup.string().email("Email invalide").required("Email est requis"),
});

export function SheetEditProfile({ refetch, dataProfil }) {
  const userId = getUserIdFromToken();
  const isGoogleAccount = !!dataProfil?.googleId;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [hiddenImg, setHiddenImg] = useState(false);

  const { mutate: editUserMutate, isPending } = useMutation({
    mutationFn: (userData) => editUser(userId, userData),
    onSuccess: (response) => {
      refetch();
      setIsSheetOpen(false);
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message || "Erreur lors de la mise à jour");
    },
  });

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
      editUserMutate(formData);
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
    setIsSheetOpen(open);
    if (!open) {
      formik.resetForm();
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
        <Button className="mt-4 text-xs" onClick={() => setIsSheetOpen(true)}>
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
              {...formik.getFieldProps("prenom")}
              className="col-span-3"
              required
              disabled={isGoogleAccount}
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
              {...formik.getFieldProps("nom")}
              className="col-span-3"
              required
              disabled={isGoogleAccount}
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
              {...formik.getFieldProps("username")}
              className="col-span-3"
              required
              disabled={isGoogleAccount}
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
              disabled={isGoogleAccount}
            />
          </div>
          <SheetFooter>
            {!isSaveDisabled && (
              <Button
                variant="outline"
                onClick={() => {
                  formik.resetForm(), setHiddenImg(false), setPreview(false);
                }}
              >
                Annuler
              </Button>
            )}

            <ButtonLoading
              type="submit"
              text="Enregistrer"
              isPending={isPending}
              disabled={isPending || isGoogleAccount}
            />
          </SheetFooter>
        </form>
        {isGoogleAccount && (
          <p className="text-[10px] italic text-muted-foreground">
            <span className="text-red-500">*</span> Impossible de modifier un
            compte google
          </p>
        )}
        <div className="relative rounded-full group mx-auto mt-16 w-fit">
          {dataProfil?.img && !hiddenImg && !isGoogleAccount && (
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
                <img
                  src={dataProfil.img}
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
              </Avatar>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

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
import { editUser } from "../../services/user.service";
import ButtonLoading from "../../components/buttons/buttonLoading";
import { useAuth } from "../../context/authContext";

const validationSchema = yup.object({
  prenom: yup.string().required("Prénom est requis"),
  nom: yup.string().required("Nom est requis"),
  phone: yup.string().required("Téléphone est requis"),
  address: yup.string().required("Adresse est requise"),
  zipcode: yup.string().required("Code postal est requis"),
  city: yup.string().required("Ville est requise"),
  username: yup.string().email("Email invalide").required("Email est requis"),
});

export function SheetEditProfile({ refetch, dataProfil }) {
  const isGoogleAccount = !!dataProfil?.googleId;

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { mutate: editUserMutate, isPending } = useMutation({
    mutationFn: (userData) => editUser(dataProfil._id, userData),
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
      phone: dataProfil?.phone || "",
      address: dataProfil?.address || "",
      zipcode: dataProfil?.zipcode || "",
      city: dataProfil?.city || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("nom", values.nom);
      formData.append("prenom", values.prenom);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("zipcode", values.zipcode);
      formData.append("city", values.city);
      editUserMutate(formData);
    },
  });

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
    dataProfil?.phone,
    dataProfil?.address,
    dataProfil?.zipcode,
    dataProfil?.city,
    dataProfil?.img || null,
  ];

  const dataEdit = [
    formik.values.prenom,
    formik.values.nom,
    formik.values.username,
    formik.values.phone,
    formik.values.address,
    formik.values.zipcode,
    formik.values.city,
    formik.values.file,
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsSheetOpen(true)}
          className="w-fit"
        >
          Modifier mes informations
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
            <Label htmlFor="phone" className="text-right">
              Téléphone
            </Label>
            <Input
              id="phone"
              name="phone"
              {...formik.getFieldProps("phone")}
              className="col-span-3"
              required
              disabled={isGoogleAccount}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-red-500 mt-1 col-span-4 text-right">
                {formik.errors.phone}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Input
              id="address"
              name="address"
              {...formik.getFieldProps("address")}
              className="col-span-3"
              required
              disabled={isGoogleAccount}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-xs text-red-500 mt-1 col-span-4 text-right">
                {formik.errors.address}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zipcode" className="text-right">
              Code postal
            </Label>
            <Input
              id="zipcode"
              name="zipcode"
              {...formik.getFieldProps("zipcode")}
              className="col-span-3"
              required
              disabled={isGoogleAccount}
            />
            {formik.touched.zipcode && formik.errors.zipcode && (
              <p className="text-xs text-red-500 mt-1 col-span-4 text-right">
                {formik.errors.zipcode}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              Ville
            </Label>
            <Input
              id="city"
              name="city"
              {...formik.getFieldProps("city")}
              className="col-span-3"
              required
              disabled={isGoogleAccount}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-xs text-red-500 mt-1 col-span-4 text-right">
                {formik.errors.city}
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
          <SheetFooter>
            {!isSaveDisabled && (
              <Button
                variant="outline"
                onClick={() => {
                  (formik.resetForm(), setHiddenImg(false), setPreview(false));
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
      </SheetContent>
    </Sheet>
  );
}

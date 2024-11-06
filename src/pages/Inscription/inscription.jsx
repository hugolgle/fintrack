import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../composant/routes";
import Title from "../../composant/Text/title";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addUser } from "../../service/user.service";
import { useMutation } from "@tanstack/react-query";

export default function Inscription() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRef = useRef(null);

  const validationSchema = Yup.object().shape({
    username: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .required("Mot de passe requis"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Les mots de passe doivent correspondre"
      )
      .required("Confirmation du mot de passe requise"),
    nom: Yup.string().required("Nom requis"),
    prenom: Yup.string().required("Prénom requis"),
    img: Yup.mixed().nullable().optional(),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      nom: "",
      prenom: "",
      img: null,
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("nom", values.nom);
      formData.append("prenom", values.prenom);
      if (image) {
        formData.append("img", image);
      }

      addUserMutation.mutate(formData);
    },
  });

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: (response) => {
      toast.success(response.message);
      formik.resetForm();
      setImage(null);
      setImagePreview(null);
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      if (error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    formik.setFieldValue("img", file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passwordRef.current && !passwordRef.current.contains(event.target)) {
        setShowPassword(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [passwordRef]);

  return (
    <>
      <Title title="Inscription" />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
        encType="multipart/form-data"
      >
        <div className="flex gap-4 w-96">
          <div className="flex flex-col items-start w-full">
            <Label htmlFor="prenom" className="mb-2 italic">
              Prénom <span className="text-red-500">*</span>
            </Label>
            <Input
              className=" h-10"
              id="prenom"
              value={formik.values.prenom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.prenom && formik.errors.prenom && (
              <p className="text-xs text-red-500 mt-1 ml-2">
                {formik.errors.prenom}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start w-full">
            <Label htmlFor="nom" className="mb-2 italic">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              className=" h-10"
              id="nom"
              value={formik.values.nom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.nom && formik.errors.nom && (
              <p className="text-xs text-red-500 mt-1 ml-2">
                {formik.errors.nom}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <Label htmlFor="username" className="mb-2 italic">
            E-mail <span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-96 h-10"
            id="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-xs text-red-500 mt-1 ml-2">
              {formik.errors.username}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <Label htmlFor="password" className="mb-2 italic">
            Mot de passe <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-96" ref={passwordRef}>
            <Input
              className="h-10"
              id="password"
              type={!showPassword ? "password" : ""}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-zinc-500"
            >
              {showPassword ? (
                <EyeOff className="w-5" />
              ) : (
                <Eye className="w-5" />
              )}
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-red-500 mt-1 ml-2">
              {formik.errors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <Label htmlFor="confirmPassword" className="mb-2 italic">
            Confirmation du mot de passe <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-96" ref={passwordRef}>
            <Input
              className="h-10"
              id="confirmPassword"
              type={!showConfirmPassword ? "password" : ""}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div
              onClick={toggleConfirmPasswordVisibility}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-zinc-500"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5" />
              ) : (
                <Eye className="w-5" />
              )}
            </div>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1 ml-2">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <Label htmlFor="image" className="mb-2 w-full italic">
            Image de profil
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formik.touched.img && formik.errors.img && (
            <p className="text-xs text-red-500 mt-1 ml-2">
              {formik.errors.img}
            </p>
          )}
        </div>

        {imagePreview && (
          <Avatar className="w-32 h-32">
            <AvatarImage className="object-cover" src={imagePreview} />
          </Avatar>
        )}

        <Button
          variant="outline"
          type="submit"
          disabled={addUserMutation.isLoading || !formik.isValid}
        >
          {addUserMutation.isLoading ? "En cours ..." : "S'inscrire"}
        </Button>
      </form>

      <div className="flex flex-col justify-center items-center gap-2 px-36">
        <p className="text-xs">Vous possédez déjà un compte ?</p>
        <Link
          to={ROUTES.LOGIN}
          className="rounded-xl bg-transparent border-2 border-zinc-700 py-2 text-sm px-4 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
        >
          Identifiez-vous !
        </Link>
      </div>
    </>
  );
}

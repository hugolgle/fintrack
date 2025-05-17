import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../composant/Routes.jsx";
import { useFormik } from "formik";
import * as yup from "yup";
import { addUser } from "../../service/user.service";
import { useMutation } from "@tanstack/react-query";
import ButtonLoading from "../../composant/Button/ButtonLoading.jsx";
import GoogleIcon from "../../../public/google-icon.svg";
import { signInWithGoogle } from "../../config/firebase.js";

export default function SignUp() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRef = useRef(null);

  const validationSchema = yup.object().shape({
    username: yup.string().email("Email invalide").required("Email requis"),
    password: yup
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      .required("Mot de passe requis"),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        "Les mots de passe doivent correspondre"
      )
      .required("Confirmation du mot de passe requise"),
    nom: yup.string().required("Nom requis"),
    prenom: yup.string().required("Prénom requis"),
    img: yup.mixed().nullable().optional(),
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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const nameParts = result.displayName.split(" ");
      const prenom = nameParts[0] || "";
      const nom = nameParts.slice(1).join(" ") || "";

      const userData = {
        username: result.email,
        nom,
        prenom,
        img: result.photoURL,
        googleId: result.uid,
      };
      addUserMutation.mutate(userData);
    } catch (error) {
      toast.error("Erreur d'authentification");
    }
  };

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
    <section className="w-full flex justify-center items-center h-screen p-4">
      <div className="w-1/4 p-4 rounded-md bg-secondary/40 ring-1 ring-border animate__animated animate__zoomIn animate__faster">
        <h1 className="text-2xl font-thin font-logo">Inscrivez-vous</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-6 animate-fade"
          encType="multipart/form-data"
        >
          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-5">
              <Input
                className="border-none bg-background"
                placeholder="Prénom"
                id="prenom"
                {...formik.getFieldProps("prenom")}
              />
              {formik.touched.prenom && formik.errors.prenom && (
                <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                  {formik.errors.prenom}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-5">
              <Input
                className="border-none bg-background"
                id="nom"
                placeholder="Nom"
                {...formik.getFieldProps("nom")}
              />
              {formik.touched.nom && formik.errors.nom && (
                <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                  {formik.errors.nom}
                </p>
              )}
            </div>
          </div>

          <Input
            className="border-none bg-background"
            id="username"
            placeholder="E-mail"
            autoComplete="new-email"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
              {formik.errors.username}
            </p>
          )}

          <div className="relative w-full" ref={passwordRef}>
            <Input
              className="border-none bg-background"
              id="password"
              autoComplete="new-password"
              placeholder="Mot de passe"
              type={!showPassword ? "password" : ""}
              {...formik.getFieldProps("password")}
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
            <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
              {formik.errors.password}
            </p>
          )}

          <div className="relative w-full" ref={passwordRef}>
            <Input
              placeholder="Confirmer votre mot de passe"
              className="border-none bg-background"
              id="confirmPassword"
              type={!showConfirmPassword ? "password" : ""}
              {...formik.getFieldProps("confirmPassword")}
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
            <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
              {formik.errors.confirmPassword}
            </p>
          )}

          <Input
            className="border-none bg-background"
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formik.touched.img && formik.errors.img && (
            <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
              {formik.errors.img}
            </p>
          )}

          {imagePreview && (
            <Avatar className="size-16">
              <AvatarImage className="object-cover" src={imagePreview} />
            </Avatar>
          )}

          <ButtonLoading
            type="submit"
            text="Inscription"
            disabled={addUserMutation.isPending}
            isPending={addUserMutation.isPending}
          />
        </form>
        <div className="flex items-center gap-2 mb-4">
          <hr className="flex-grow border-border h-[1px]" />
          <p className="text-gray-400 text-xs">Ou</p>
          <hr className="flex-grow border-border h-[1px]" />
        </div>

        <div className="flex gap-4 p-4">
          <div
            onClick={handleGoogleSignIn}
            className="bg-muted cursor-pointer justify-center flex items-center gap-2 px-4 py-2 w-full rounded-md hover:bg-muted/75 transition-all"
          >
            <img src={GoogleIcon} className="size-5" />
            <span className="text-xs font-thin">S'inscrire avec Google</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <p className="text-xs">
            Vous possédez déjà un compte ?{" "}
            <span
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-gray-400 hover:underline cursor-pointer"
            >
              Identifier-vous
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

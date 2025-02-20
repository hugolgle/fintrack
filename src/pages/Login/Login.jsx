import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../utils/users";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../composant/Routes.jsx";
import { useMutation } from "@tanstack/react-query";
import { addUser, loginUser } from "../../Service/User.service";
import { useFormik } from "formik";
import * as yup from "yup";
import { HttpStatusCode } from "axios";
import ButtonLoading from "../../composant/Button/ButtonLoading.jsx";
import AppleIcon from "../../../public/apple-icon.svg";
import GoogleIcon from "../../../public/google-icon.svg";
import { signInWithGoogle } from "../../config/firebase.js";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const { isAuthenticated } = useIsAuthenticated();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      sessionStorage.setItem("token", response.token);
      toast.success(response.message);
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      if (
        error.response &&
        error.response.status === HttpStatusCode.Unauthorized
      ) {
        toast.warning(error.response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    },
  });

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: (response) => {
      toast.success(response.message);
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

      const loginData = {
        username: result.email,
        googleId: result.uid,
      };

      // Effectuer la connexion
      mutation.mutate(loginData);

      console.log("Utilisateur connecté :", result);
    } catch (error) {
      console.error("Erreur d'authentification :", error);
    }
  };

  const validationSchema = yup.object().shape({
    username: yup.string().email("Email invalide").required("Email requis"),
    password: yup.string().required("Mot de passe requis"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
    <section className="w-full flex flex-col justify-center items-center h-screen p-4">
      <div className="w-1/4 p-4 rounded-lg bg-secondary/40  ring-1 ring-border animate__animated animate__zoomIn animate__faster">
        <h1 className="text-2xl font-logo">Connectez-vous</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-6 animate-fade"
        >
          <Input
            id="username"
            type="email"
            className="border-none bg-background"
            {...formik.getFieldProps("username")}
            placeholder="Votre e-mail"
            autoComplete="new-email"
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
              {formik.errors.username}
            </p>
          )}
          <div className="relative w-full" ref={passwordRef}>
            <Input
              id="password"
              type={!showPassword ? "password" : ""}
              className="border-none bg-background"
              {...formik.getFieldProps("password")}
              placeholder="Mot de passe"
              ref={passwordRef}
              autoComplete="new-password"
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
          <ButtonLoading
            type="submit"
            text="Connexion"
            disabled={mutation.isPending}
            isPending={mutation.isPending}
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
            className="bg-muted cursor-pointer justify-center flex items-center gap-2 px-4 py-2 w-full rounded-lg hover:bg-muted/75 transition-all"
          >
            <img src={GoogleIcon} className="size-5" />
            <span className="text-xs font-thin">Se connecter Google</span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 gap-2">
          <p className="text-xs">
            Nouveau sur FinTrack ?{" "}
            <span
              className="text-gray-400 hover:underline cursor-pointer"
              onClick={() => navigate(ROUTES.SIGNUP)}
            >
              Créer un compte FinTrack !
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

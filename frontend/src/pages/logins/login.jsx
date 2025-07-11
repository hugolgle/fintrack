import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../components/route.jsx";
import { useFormik } from "formik";
import * as yup from "yup";
import ButtonLoading from "../../components/buttons/buttonLoading.jsx";
import AppleIcon from "../../../public/apple-icon.svg";
import GoogleIcon from "../../../public/google-icon.svg";
import { signInWithGoogle } from "../../config/firebase.js";
import { useAuth } from "../../context/authContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const [animate, setAnimate] = useState();
  const { login, isPending } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      const loginData = {
        username: result.email,
        googleId: result.uid,
      };

      await login(loginData);
      setAnimate(true);
      setTimeout(() => navigate(ROUTES.HOME), 1000);
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
    onSubmit: async (values) => {
      try {
        await login(values);
        setAnimate(true);
        setTimeout(() => navigate(ROUTES.HOME), 1000);
      } catch (error) {
        toast.error("Échec de connexion", error);
      }
    },
  });

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
    <section className="w-full flex h-screen justify-center lg:justify-end gap-4">
      <div
        className={`relative flex flex-col w-full lg:w-2/5 justify-center h-full p-6 lg:p-4 rounded-none lg:rounded-l-[3em] bg-secondary/70 ring-1 ring-border animate__animated animate__fadeInRight ${
          animate && "animate__fadeOutRight"
        }`}
      >
        <p className="font-logo absolute top-4 right-4">FinTrack.</p>

        <div className="flex flex-col justify-center items-center px-4 sm:px-10 lg:px-14">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 lg:mb-10 mr-auto font-logo">
            Content de te revoir !
          </h1>
          <h2 className="text-lg sm:text-xl font-thin mr-auto">
            Connectez-vous
          </h2>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col justify-center items-center gap-4 sm:gap-5 py-6 animate-fade w-full"
          >
            <Input
              id="username"
              type="email"
              className="border-none bg-background w-full"
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
                className="border-none bg-background w-full"
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
              disabled={isPending}
              isPending={isPending}
            />
          </form>

          <div className="flex items-center gap-2 mb-4">
            <p className="text-gray-400 text-xs">Ou</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div
              onClick={handleGoogleSignIn}
              className="bg-muted cursor-pointer justify-center flex items-center gap-2 px-4 py-2 w-full rounded-md hover:bg-muted/75 transition-all"
            >
              <img src={GoogleIcon} className="size-5" />
              <span className="text-xs font-thin text-nowrap">
                Se connecter Google
              </span>
            </div>
            <div className="bg-muted cursor-pointer justify-center flex items-center gap-2 px-4 py-2 w-full rounded-md hover:bg-muted/75 transition-all">
              <img src={AppleIcon} className="size-5" />
              <span className="text-xs font-thin text-nowrap">
                Se connecter Apple
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center mt-5 gap-2 text-center">
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
      </div>
    </section>
  );
}

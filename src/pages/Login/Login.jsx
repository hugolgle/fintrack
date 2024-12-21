import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../utils/users";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../composant/Routes.jsx";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../Service/User.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HttpStatusCode } from "axios";
import ButtonLoading from "../../composant/Button/ButtonLoading.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const { isAuthenticated } = useIsAuthenticated();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      sessionStorage.setItem("token", data.token);
      toast.success("Vous êtes connecté !");
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

  const validationSchema = Yup.object().shape({
    username: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string().required("Mot de passe requis"),
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
    <section className="w-full flex justify-center items-center h-screen p-4">
      <div className="w-1/4 p-4 rounded-3xl bg-secondary  ring-1 ring-border animate__animated animate__zoomIn animate__faster">
        <img
          src="/public/logoFinTrack.png"
          className="size-16 mx-auto mb-4"
          alt="logo"
        />
        <h1 className="text-2xl font-thin font-logo">Connectez-vous</h1>
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
            required
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
              required
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
            disabled={mutation.isPending || !formik.isValid}
            isPending={mutation.isPending}
            classname="w-full"
          />
        </form>
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

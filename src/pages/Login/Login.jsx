import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../utils/users";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../composant/Routes.jsx";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../Service/User.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HttpStatusCode } from "axios";
import { LoaderCircle } from "lucide-react";
import Header from "../../composant/Header.jsx";
import ButtonLoading from "../../composant/Button/ButtonLoading.jsx";

export default function Login() {
  const navigate = useNavigate();
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

  return (
    <section className="w-full">
      <Header title="S'identifier" />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Input
          id="username"
          type="email"
          {...formik.getFieldProps("username")}
          placeholder="Votre e-mail"
          required
        />
        {formik.touched.username && formik.errors.username && (
          <p className="text-xs text-left flex items-start w-full text-red-500 -mt-3 ml-2">
            {formik.errors.username}
          </p>
        )}

        <Input
          id="password"
          type="password"
          {...formik.getFieldProps("password")}
          placeholder="Mot de passe"
          ref={passwordRef}
          required
        />

        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-left flex items-start w-full text-red-500 -mt-3 ml-2">
            {formik.errors.password}
          </p>
        )}
        <ButtonLoading
          variant="outline"
          type="submit"
          text="Connexion"
          textBis="Connexion"
          disabled={mutation.isPending || !formik.isValid}
          isPending={mutation.isPending}
        />
      </form>
      <div className="flex flex-col justify-center items-center mt-5 gap-2">
        <p className="text-xs">Nouveau sur FinTrack ?</p>
        <Button variant="secondary" onClick={() => navigate(ROUTES.SIGNUP)}>
          Créer un compte FinTrack !
        </Button>
      </div>
    </section>
  );
}

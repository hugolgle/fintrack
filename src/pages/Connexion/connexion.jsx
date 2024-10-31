import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { useIsAuthenticated } from "../../utils/users";
import Title from "../../composant/Text/title";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../composant/routes";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../service/user.service";

export default function Connexion() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      sessionStorage.setItem("token", data.token);
      toast.success("Vous êtes connecté !");
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      if (error.response && error.response.status === 401) {
        toast.error("Mot de passe ou nom d'utilisateur incorrect");
      } else {
        toast.error("Une erreur s'est produite lors de la connexion.");
      }
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  const { isAuthenticated, isLoading, isError } = useIsAuthenticated();

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
    <>
      <Title title="S'identifier" />
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
      >
        <div className="flex flex-col items-start">
          <Input
            className="w-96 h-10 px-2"
            id="login"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre e-mail"
            required
          />
        </div>

        <div className="flex flex-col items-start">
          <div className="relative w-96" ref={passwordRef}>
            <Input
              className="h-10 px-2"
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowPassword(false);
              }}
              placeholder="Mot de passe"
              required
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
        </div>

        <Button
          variant="outline"
          className="rounded-xl"
          type="submit"
          disabled={mutation.isLoading}
        >
          Connexion
        </Button>
      </form>
      <div className="flex flex-col justify-center items-center gap-2 px-36">
        <p className="text-xs">Nouveau sur DashCash ?</p>
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.SIGNUP)}
          className="rounded-xl"
        >
          Créer un compte DashCash !
        </Button>
      </div>
    </>
  );
}

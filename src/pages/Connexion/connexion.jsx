import { useState, FormEvent, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/actions/user.action";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { isConnected } from "../../utils/users";
import Title from "../../composant/Text/title";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";

export default function Connexion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null); // Créer une référence pour l'input de mot de passe

  const messageError = useSelector((state) => state.userReducer?.error);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(username, password));
      if (messageError) {
        toast.error(messageError);
      } else {
        toast.success("Vous êtes connecté !");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error("Une erreur s'est produite lors de la connexion.");
    }
  };

  const isConnect = isConnected();

  useEffect(() => {
    if (isConnect) {
      navigate("/");
    }
  }, [isConnect, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Bascule la visibilité
  };

  // Utiliser useEffect pour gérer les clics à l'extérieur de l'input de mot de passe
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passwordRef.current && !passwordRef.current.contains(event.target)) {
        setShowPassword(false); // Cacher le mot de passe si le clic est à l'extérieur
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Écouter les clics
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Nettoyer l'écouteur
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
          <Label htmlFor="login" className="mb-2 italic">
            E-mail
          </Label>
          <Input
            className="w-96 h-10 px-2"
            id="login"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col items-start">
          <Label htmlFor="password" className="mb-2 italic">
            Mot de passe
          </Label>
          <div className="relative w-96" ref={passwordRef}>
            <Input
              className="h-10 px-2"
              id="password"
              type={showPassword ? "text" : "password"} // Changer le type selon l'état
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowPassword(false);
              }} // Met à jour le mot de passe
              required
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button variant="outline" className="rounded-xl" type="submit">
          Connexion
        </Button>
      </form>
      <div className="flex flex-col justify-center items-center gap-2 px-36">
        <p className="text-xs">Nouveau sur DashCash ?</p>
        <Button
          variant="secondary"
          onClick={() => navigate("/inscription")}
          className="rounded-xl"
        >
          Créer un compte DashCash !
        </Button>
      </div>
    </>
  );
}

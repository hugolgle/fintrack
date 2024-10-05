import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../../redux/actions/user.action";
import Title from "../../composant/Text/title";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { EyeOff, Eye } from "lucide-react";

export default function Inscription() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null); // Référence pour l'input de mot de passe

  const handleNewUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("pseudo", pseudo);
    formData.append("nom", nom);
    formData.append("prenom", prenom);

    if (image) {
      formData.append("img", image);
    }

    try {
      await dispatch(addUser(formData));
      toast.success("Inscription réussie !");
      setUsername("");
      setPassword("");
      setPseudo("");
      setNom("");
      setPrenom("");
      setImage(null);
      setImagePreview(null);
      navigate("/connexion");
    } catch (err) {
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Bascule la visibilité
  };

  // Gestion des clics en dehors de l'input de mot de passe
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
      <Title title="Inscription" />
      <form
        onSubmit={handleNewUser}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
        encType="multipart/form-data"
      >
        <div className="flex gap-4">
          <div className="flex flex-col items-start">
            <Label htmlFor="login" className="mb-2 italic">
              E-mail <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-96 h-10"
              id="login"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-start">
            <Label htmlFor="password" className="mb-2 italic">
              Mot de passe <span className="text-red-500">*</span>
            </Label>
            <div className="relative w-96" ref={passwordRef}>
              <Input
                className="h-10"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowPassword(false); // Optionnel : Cacher le mot de passe après modification
                }}
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
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-start">
            <Label htmlFor="prenom" className="mb-2 italic">
              Prénom <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-96 h-10 "
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-start">
            <Label htmlFor="nom" className="mb-2 italic">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-96 h-10"
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col items-start">
          <Label htmlFor="pseudo" className="mb-2 italic">
            Pseudo <span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-96 h-10"
            id="pseudo"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
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
        </div>

        {imagePreview && (
          <Avatar className="w-32 h-32">
            <AvatarImage className="object-cover" src={imagePreview} />
          </Avatar>
        )}

        <Button variant="outline" className="rounded-xl " type="submit">
          S'inscrire
        </Button>
      </form>

      <div className="flex flex-col justify-center items-center gap-2 px-36">
        <p className="text-xs">Vous possédez déjà un compte ?</p>
        <Link
          to="/connexion"
          className="rounded-xl bg-transparent border-2 border-zinc-700 py-2 text-sm px-4 transition-all hover:bg-zinc-200 hover:dark:bg-zinc-700"
        >
          Identifiez-vous !
        </Link>
      </div>
    </>
  );
}

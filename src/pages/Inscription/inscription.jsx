import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Ensure you're using the right toast library
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { EyeOff, Eye } from "lucide-react";
import { ROUTES } from "../../composant/routes";
import { useAddUser } from "../../hooks/user.hooks"; // Ensure this path is correct
import Title from "../../composant/Text/title";

export default function Inscription() {
  const navigate = useNavigate();
  const { mutate: addUser, isLoading } = useAddUser(); // Destructure mutate and isLoading

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  const handleNewUser = (e) => {
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

    // Use the addUser mutation
    addUser(formData, {
      onSuccess: () => {
        toast.success("Inscription réussie !");
        // Clear form fields after success
        setUsername("");
        setPassword("");
        setPseudo("");
        setNom("");
        setPrenom("");
        setImage(null);
        setImagePreview(null);
        navigate(ROUTES.LOGIN);
      },
      onError: (error) => {
        console.error("Error adding user:", error); // Debugging line
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      },
    });
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
                  setShowPassword(false);
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

        <Button
          variant="outline"
          className="rounded-xl"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "En cours..." : "S'inscrire"}
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

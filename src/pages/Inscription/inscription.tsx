import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { addUser } from "../../redux/actions/user.action";
import Title from "../../composant/Text/title";

export default function Inscription() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pseudo, setPseudo] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const handleNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
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
      setMessage("Inscription réussie !");
      setUsername("");
      setPassword("");
      setPseudo("");
      setNom("");
      setPrenom("");
      setImage(null);
      setImagePreview(null);
      navigate("/connexion");
    } catch (err) {
      setMessageError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Révoquer l'URL de l'image une fois que le composant est démonté
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <>
      <Title title="Inscription" />
      <form
        onSubmit={handleNewUser}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <label htmlFor="login" className="mb-2">
            Nom d'utilisateur :
          </label>
          <input
            className="w-96 h-10 px-2 rounded-xl ring-1 ring-zinc-300 dark:ring-zinc-700"
            id="login"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2">
            Mot de passe :
          </label>
          <input
            className="w-96 h-10 px-2 rounded-xl ring-1 ring-zinc-300 dark:ring-zinc-700"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="pseudo" className="mb-2">
            Pseudo :
          </label>
          <input
            className="w-96 h-10 px-2 rounded-xl ring-1 ring-zinc-300 dark:ring-zinc-700"
            id="pseudo"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="nom" className="mb-2">
            Nom :
          </label>
          <input
            className="w-96 h-10 px-2 rounded-xl ring-1 ring-zinc-300 dark:ring-zinc-700"
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="prenom" className="mb-2">
            Prénom :
          </label>
          <input
            className="w-96 h-10 px-2 rounded-xl ring-1 ring-zinc-300 dark:ring-zinc-700"
            id="prenom"
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="image" className="mb-2">
            Image de profil :
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <div className="w-full flex justify-center">
            <img
              src={imagePreview}
              alt="Prévisualisation"
              className="mt-4 max-w-full h-auto"
            />
          </div>
        )}

        <Button
          variant="outline"
          className="rounded-xl w-1/4 hover:border-blue-500"
          type="submit"
        >
          S'inscrire
        </Button>
      </form>

      <div className="flex flex-col justify-center items-center gap-2 px-36">
        <p className="text-xs">Vous possédez déjà un compte ?</p>
        <Link
          to="/connexion"
          className="rounded-xl bg-transparent border-2 border-zinc-700 py-2 text-sm px-4 transition-all hover:bg-zinc-300 hover:dark:bg-zinc-700"
        >
          Identifiez-vous !
        </Link>
      </div>

      {(message || messageError) && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 animate-[fadeIn2_0.3s_ease-in-out_forwards]">
          {message && (
            <p className="p-4 bg-lime-900 w-60 rounded opacity-100">
              {message}
              <Link
                to="/connexion"
                className="underline transition-all hover:text-zinc-950"
              >
                Connectez-vous !
              </Link>
            </p>
          )}
          {messageError && (
            <p className="p-4 bg-red-900 w-60 rounded opacity-100">
              {messageError}
            </p>
          )}
        </div>
      )}
    </>
  );
}

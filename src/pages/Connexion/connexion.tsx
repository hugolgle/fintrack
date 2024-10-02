import { useState, FormEvent, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/actions/user.action";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { isConnected } from "../../utils/users";
import Title from "../../composant/Text/title";
import { MessageContext } from "@/context/MessageContext";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export default function Connexion() {
  const messageContext = useContext(MessageContext);
  if (!messageContext) {
    throw new Error("MyComponent must be used within a MessageProvider");
  }
  const { showMessage } = messageContext;

  // Typage du dispatch avec ThunkDispatch
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const messageError = useSelector((state: any) => state.userReducer?.error);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(username, password)); // Dispatch de l'action asynchrone
    if (messageError) {
      showMessage(messageError, "bg-red-500");
    } else {
      showMessage("Vous êtes connecté !", "bg-green-500");
    }
  };

  const isConnect = isConnected();

  useEffect(() => {
    if (isConnect) {
      navigate("/");
    }
  }, [isConnect, navigate]);

  return (
    <>
      <Title title="S'identifier" />{" "}
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
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

        <Button
          variant="outline"
          className="rounded-xl w-1/4 hover:border-blue-500"
          type="submit"
        >
          Connexion
        </Button>
      </form>
      <div className="flex flex-col justify-center items-center gap-2 px-36">
        <p className="text-xs">Nouveau sur DashCash ?</p>
        <Link
          to="/inscription"
          className="rounded-xl bg-transparent border-2 border-zinc-700  py-2 text-sm px-4 transition-all hover:bg-zinc-300 hover:dark:bg-zinc-700"
          type="submit"
        >
          Créer un compte DashCash !
        </Link>
      </div>
    </>
  );
}

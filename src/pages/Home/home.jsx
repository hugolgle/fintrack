import Logo from "../../composant/logo";
import { infoUser, isConnected } from "../../utils/users";
import { Link } from "react-router-dom";

export default function Home() {
  const isAuthenticated = isConnected();
  const userInfo = infoUser();
  return (
    <section className="flex flex-col justify-center items-center h-full gap-14 animate-fade">
      <div>
        <h1 className="font-light">
          Bienvenue <span className="font-bold">{userInfo.pseudo}</span> sur
        </h1>
        <Logo />
      </div>
      {isAuthenticated ? (
        <Link
          to="/tdb"
          className="p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl transition-all duration-500 hover:dark:bg-cyan-500"
        >
          C'est parti !
        </Link>
      ) : (
        <Link
          to="/connexion"
          className="p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl transition-all duration-500 hover:dark:bg-lime-500"
        >
          Connectez-vous !
        </Link>
      )}
    </section>
  );
}

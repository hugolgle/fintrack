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
        <div className="flex justify-center items-center tracking-tight mt-6 font-logo group">
          <p className="p-2 text-6xl bg-transparent dark:bg-white text-zinc-900 dark:text-zinc-900 group-hover:bg-colorPrimaryDark group-hover:dark:bg-transparent group-hover:text-white group-hover:dark:text-white transition-all">
            D A S H
          </p>
          <p className="p-2 text-6xl bg-colorPrimaryDark dark:bg-transparent text-white dark:text-white group-hover:bg-transparent group-hover:dark:bg-white group-hover:text-zinc-900 group-hover:dark:text-zinc-900 transition-all">
            C A S H
          </p>
        </div>
      </div>
      {isAuthenticated ? (
        <Link
          to="/tdb"
          className="p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl transition-all hover:bg-colorPrimaryLight hover:dark:bg-colorSecondaryDark"
        >
          C'est parti !
        </Link>
      ) : (
        <Link
          to="/connexion"
          className="p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl transition-all hover:bg-colorPrimaryLight hover:dark:bg-colorSecondaryDark"
        >
          Connectez-vous !
        </Link>
      )}
    </section>
  );
}

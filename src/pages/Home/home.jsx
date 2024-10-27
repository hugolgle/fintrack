import Loader from "../../composant/loader";
import Logo from "../../composant/logo";
import { ROUTES } from "../../composant/routes";
import { useCurrentUser } from "../../hooks/user.hooks";
import { useIsAuthenticated } from "../../utils/users";
import { Link } from "react-router-dom";

export default function Home() {
  const { isAuthenticated, isLoading: loadingAuth } = useIsAuthenticated();
  const { data: userInfo, isLoading: loadingUser } = useCurrentUser();

  if (loadingAuth || loadingUser) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col justify-center items-center h-full gap-14 animate-fade">
      <div>
        <h1 className="font-light">
          Bienvenue <span className="font-bold">{userInfo?.pseudo}</span> sur
        </h1>
        <Logo />
      </div>
      {isAuthenticated ? (
        <Link
          to={ROUTES.DASHBOARD}
          className="p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl transition-all duration-500 hover:!bg-cyan-500"
        >
          C'est parti !
        </Link>
      ) : (
        <Link
          to={ROUTES.LOGIN}
          className="p-4 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl transition-all duration-500 hover:!bg-lime-500"
        >
          Connectez-vous !
        </Link>
      )}
    </section>
  );
}

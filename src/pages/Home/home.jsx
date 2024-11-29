import { useQuery } from "@tanstack/react-query";
import Loader from "../../composant/Loader/Loader";
import { ROUTES } from "../../composant/Routes.jsx";
import { getUserIdFromToken } from "../../utils/users";
import { getCurrentUser } from "../../Service/User.service";
import { useIsAuthenticated } from "../../utils/users";
import { Link } from "react-router-dom";

export default function Home() {
  const userId = getUserIdFromToken();
  const { isAuthenticated, isLoading: loadingAuth } = useIsAuthenticated();
  const { data: userInfo, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  if (loadingAuth || loadingUser) return <Loader />;

  return (
    <section className="flex flex-col justify-center items-center h-full gap-14 animate-fade">
      <div>
        <h1 className="font-light text-5xl">
          Bienvenue <span className="font-bold">{userInfo?.prenom}</span> sur
        </h1>
        <p className="text-5xl mt-3 font-logo">FinTrack</p>
      </div>
      {isAuthenticated ? (
        <Link
          to={ROUTES.DASHBOARD}
          className="p-4 bg-primary-foreground rounded-xl transition-all duration-500 hover:!bg-cyan-500"
        >
          C'est parti !
        </Link>
      ) : (
        <Link
          to={ROUTES.LOGIN}
          className="p-4 bg-primary-foreground rounded-xl transition-all duration-500 hover:!bg-lime-500"
        >
          Connectez-vous !
        </Link>
      )}
    </section>
  );
}

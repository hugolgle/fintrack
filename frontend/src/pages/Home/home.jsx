import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader/Loader";
import { ROUTES } from "../../components/Routes.jsx";
import { getUserIdFromToken } from "../../utils/users";
import { getCurrentUser } from "../../service/user.service";
import { useIsAuthenticated } from "../../utils/users";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const { isAuthenticated, isLoading: isLoadingAuth } = useIsAuthenticated();
  const { data: dataUser, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  if (isLoadingAuth || isLoading) return <Loader />;

  return (
    <section className="w-full h-screen">
      <div className="flex flex-col justify-center animate__animated animate__zoomIn animate__faster items-center h-full gap-10 animate-fade">
        <img
          src="/public/logoFinTrack.png"
          className="size-16 mx-auto"
          alt="logo"
        />
        <div>
          <h1 className="font-light text-5xl">
            Bienvenue <span className="font-bold">{dataUser?.prenom}</span> sur
          </h1>
          <p className="text-5xl mt-3 font-logo font-thin">FinTrack</p>
        </div>
        {isAuthenticated ? (
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            C'est parti !
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Connectez-vous !
          </Button>
        )}
      </div>
    </section>
  );
}

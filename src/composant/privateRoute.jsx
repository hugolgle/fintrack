import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../utils/users"; // Hook pour vérifier l'authentification
import { toast } from "sonner"; // Pour afficher les messages d'erreur
import Loader from "./loader"; // Composant de chargement
import { ROUTES } from "./routes";

const PrivateRoute = ({ element }) => {
  const userId = localStorage.getItem("userId");

  const { isAuthenticated, isLoading, isError } = useIsAuthenticated(userId);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    toast.error(
      "Une erreur s'est produite lors de la vérification de l'authentification."
    );
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (!isAuthenticated) {
    toast.error("Vous n'êtes pas connecté !");
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return element;
};

export default PrivateRoute;

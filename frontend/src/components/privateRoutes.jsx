import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../utils/users.js";
import { toast } from "sonner";
import { ROUTES } from "./route.jsx";
import Loader from "./loaders/loader.jsx";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, isLoading, isError } = useIsAuthenticated();

  if (isLoading) return <Loader />;

  if (!isAuthenticated || isError) {
    toast.error("Vous n'êtes pas connecté !");
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return element;
};

export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { isConnected } from "../utils/users";
import { ROUTES } from "./routes";
import { toast } from "sonner";
const PrivateRoute = ({ element }) => {
  const isAuthenticated = isConnected();

  if (!isAuthenticated) {
    toast.error("Vous n'êtes pas connecté !");
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return element;
};

export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../utils/users.js";
import { ROUTES } from "./route.jsx";
import Loader from "./loaders/loader.jsx";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} />;

  return element;
};

export default PrivateRoute;

import { Navigate } from "react-router-dom";
import { ROUTES } from "./route.jsx";
import Loader from "./loaders/loader.jsx";
import { useAuth } from "../context/authContext.jsx";

const PrivateRoute = ({ element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to={ROUTES.LOGIN} />;

  return element;
};

export default PrivateRoute;

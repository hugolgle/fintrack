import { Navigate } from "react-router-dom";
import { isConnected } from "../utils/users"; // Assurez-vous que cette fonction vérifie l'état de connexion de l'utilisateur

const PrivateRoute = ({ element }) => {
  const isAuthenticated = isConnected();

  return isAuthenticated ? element : <Navigate to="/connexion" />;
};

export default PrivateRoute;

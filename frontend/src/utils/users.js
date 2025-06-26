import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/user.service";

export const getUserIdFromToken = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id;
  } catch (error) {
    throw new Error("Erreur lors du décodage du token.");
  }
};

export const useIsAuthenticated = () => {
  const userId = getUserIdFromToken();

  const {
    isLoading,
    data: currentUser,
    isError,
  } = useQuery({
    queryKey: ["currentUser", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });

  return { isAuthenticated: !!currentUser && !!userId, isLoading, isError };
};

export function getInitials(prenom = "", nom = "") {
  const initialPrenom = prenom.charAt(0).toUpperCase();
  const initialNom = nom.charAt(0).toUpperCase();

  return `${initialPrenom}${initialNom}`;
}

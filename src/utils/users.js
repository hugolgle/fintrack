import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../service/user.service";

export const useIsAuthenticated = (userId) => {
  const queryKey = ["currentUser", userId];

  // Hook useQuery pour récupérer l'utilisateur courant
  const {
    data: currentUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId, // Activer la requête seulement si userId est défini
  });

  return { isAuthenticated: !!currentUser, isLoading, isError };
};

// Fonction pour obtenir les initiales
export function getInitials(prenom = "", nom = "") {
  const initialPrenom = prenom.charAt(0).toUpperCase(); // Assure que prenom n'est pas vide
  const initialNom = nom.charAt(0).toUpperCase(); // Assure que nom n'est pas vide

  return `${initialPrenom}${initialNom}`; // Retourne les initiales combinées
}

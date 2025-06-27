import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/user.service";

export const useIsAuthenticated = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return {
    isAuthenticated: !!data,
    isLoading,
    isError,
  };
};

export function getInitials(prenom = "", nom = "") {
  const initialPrenom = prenom.charAt(0).toUpperCase();
  const initialNom = nom.charAt(0).toUpperCase();

  return `${initialPrenom}${initialNom}`;
}

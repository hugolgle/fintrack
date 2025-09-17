import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/user.service.jsx";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la connexion"
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      toast.success("Vous vous êtes déconnecté !");
    },
    onError: () => {
      toast.error("Erreur lors de la déconnexion.");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isFetching,
        isError,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isPending: loginMutation.isPending,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

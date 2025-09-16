import React, { createContext, useContext, useState, useEffect } from "react";
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
      queryClient.setQueryData(["currentUser"], data);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries(["currentUser"]);
      toast.success("Vous vous êtes déconnecté !");
    },
    onError: () => {
      toast.error("Erreur lors de la déconnexion.");
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCurrentUser();
      } catch {}
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
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

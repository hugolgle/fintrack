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
  const [user, setUser] = useState(null);

  const { isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    onSuccess: (data) => setUser(data),
    onError: () => setUser(null),
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["currentUser"], data);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Échec de la connexion.");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries(["currentUser"]);
      setUser(null);
      toast.success("Vous vous êtes déconnecté !");
    },
    onError: () => {
      toast.error("Erreur lors de la déconnexion.");
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      }
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

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      setUser(response.user);
      queryClient.setQueryData(["currentUser"], response);
      toast.success(response.message || "Connexion réussie !");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de la connexion.");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      queryClient.removeQueries(["currentUser"]);
      setUser(null);
      toast.success("Vous vous êtes déconnecté !");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion.");
    }
  };

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
        login,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

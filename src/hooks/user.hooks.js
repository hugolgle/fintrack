// src/hooks/auth.hooks.js

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  addUser,
  editUser,
  deleteUser,
} from "../service/user.service";
import { useNavigate } from "react-router-dom";

export const useCurrentUser = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("token", data.token);
      navigate("/");
    },
    onError: (error) => {
      console.error(
        "Login error:",
        error.response?.data.message || error.message
      );
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("userId");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error.message);
    },
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      console.log("User added:", data);
    },
    onError: (error) => {
      console.error("Error adding user:", error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    },
  });
};

export const useEditUser = (userId) => {
  return useMutation({
    mutationFn: (userData) => {
      // Check if userData is a FormData instance
      if (!(userData instanceof FormData)) {
        throw new Error("Les données envoyées doivent être un FormData");
      }
      return editUser(userId, userData);
    },
    onSuccess: (data) => {
      console.log("Utilisateur mis à jour :", data);
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la mise à jour utilisateur :",
        error.message
      );
    },
  });
};

// Hook to delete a user
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      console.log("User deleted:", data);
    },
    onError: (error) => {
      console.error("Error deleting user:", error.message);
    },
  });
};

import { jwtDecode } from "jwt-decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  addUser,
  editUser,
  deleteUser,
} from "../service/user.service";
import { useNavigate } from "react-router-dom";

const getUserIdFromToken = () => {
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

export const useCurrentUser = () => {
  const userId = getUserIdFromToken();
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
      sessionStorage.setItem("token", data.token);
      navigate("/");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      sessionStorage.removeItem("token");
      queryClient.clear();
      navigate("/login");
    },
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: addUser,
    onError: () => {
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    },
  });
};

export const useEditUser = () => {
  const userId = getUserIdFromToken();

  return useMutation({
    mutationFn: (userData) => {
      if (!(userData instanceof FormData)) {
        throw new Error("Les données envoyées doivent être un FormData");
      }
      return editUser(userId, userData);
    },
  });
};

export const useDeleteUser = () => {
  const userId = getUserIdFromToken();

  return useMutation({
    mutationFn: () => deleteUser(userId),
  });
};

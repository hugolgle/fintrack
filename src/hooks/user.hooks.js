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
import { toast } from "sonner";

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
    onSuccess: (event) => {
      toast.success(event.message);
    },
    onError: (error) => {
      if (error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    },
  });
};

export const useEditUser = () => {
  const userId = getUserIdFromToken();

  return useMutation({
    mutationFn: (userData) => {
      return editUser(userId, userData);
    },
    onSuccess: (event) => {
      toast.success(event.message);
    },
    onError: (error) => {
      if (error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la modification. Veuillez réessayer.");
      }
    },
  });
};

export const useDeleteUser = () => {
  const userId = getUserIdFromToken();

  return useMutation({
    mutationFn: () => deleteUser(userId),
  });
};

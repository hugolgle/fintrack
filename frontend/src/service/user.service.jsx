import axios from "axios";

const API_URL = `${process.env.API_URL}/user`;

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const logoutUser = async () => {};

export const getCurrentUser = async (userId) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const response = await axios.get(`${API_URL}/current/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/user/add",
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Erreur lors de l'inscription"
      );
    } else {
      throw new Error("Erreur lors de la connexion au serveur.");
    }
  }
};

export const editUser = async (userId, userData) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }
  try {
    const response = await axios.put(`${API_URL}/edit/${userId}`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Erreur lors de la modification"
      );
    } else {
      throw new Error("Erreur lors de la connexion au serveur.");
    }
  }
};

export const deleteUser = async (userId) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const response = await axios.delete(`${API_URL}/delete/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

import axios from "axios";

const API_URL = "http://localhost:5001/user";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const logoutUser = async () => {};

export const getCurrentUser = async (userId) => {
  const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
  const response = await axios.get(`${API_URL}/current/${userId}`, {
    headers: {
      Authorization: token, // Ajouter le token dans l'en-tête
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
    throw error;
  }
};

export const editUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/edit/${userId}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/delete/${userId}`);
  return response.data;
};

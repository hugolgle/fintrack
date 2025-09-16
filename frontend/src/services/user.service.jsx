import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/user`;

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const logoutUser = async () => {
  return await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/current`, {
    withCredentials: true,
  });
  return response.data;
};

export const signUpUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
  try {
    const response = await axios.put(`${API_URL}/edit/${userId}`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
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

export const deleteAccount = async () => {
  const response = await axios.delete(`${API_URL}/delete`, {
    withCredentials: true,
  });
  return response.data;
};

export const updateImg = async (userId, imgData) => {
  try {
    const isFormData = imgData instanceof FormData;

    const response = await axios.patch(`${API_URL}/edit/${userId}`, imgData, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message ||
          "Erreur lors de la mise à jour de l'image"
      );
    } else {
      throw new Error("Erreur lors de la connexion au serveur.");
    }
  }
};

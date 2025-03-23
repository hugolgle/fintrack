import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5001/credits";

// Récupérer tous les crédits d’un utilisateur
export const fetchCredits = async () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  return await axios.get(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Récupérer un crédit spécifique
export const fetchCredit = async (id) => {
  const token = sessionStorage.getItem("token");
  return await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Créer un crédit
export const addCredit = async (creditData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const newCreditData = {
    user: userId,
    ...creditData,
  };

  return await axios.post(`${API_URL}`, newCreditData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Mettre à jour un crédit
export const editCredit = async (creditData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const updatedCreditData = {
    user: userId,
    ...creditData,
  };

  try {
    const response = await axios.put(
      `${API_URL}/${creditData.id}`,
      updatedCreditData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du crédit :", error);
    throw error;
  }
};

// Supprimer un crédit
export const deleteCredit = async (id) => {
  const token = sessionStorage.getItem("token");
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Ajouter un paiement sur un crédit
export const addPayment = async (id, paymentData) => {
  const token = sessionStorage.getItem("token");
  return await axios.post(`${API_URL}/${id}/payment`, paymentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateStatus = async (id, status) => {
  const token = sessionStorage.getItem("token");
  return await axios.patch(
    `${API_URL}/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deletePayment = async (creditId, paymentId) => {
  const token = sessionStorage.getItem("token");
  return await axios.delete(`${API_URL}/${creditId}/payment/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

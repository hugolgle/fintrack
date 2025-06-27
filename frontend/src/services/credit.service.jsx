import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/credits`;

// Récupérer tous les crédits d’un utilisateur
export const fetchCredits = async () => {
  return await axios.get(`${API_URL}/user`, {
    withCredentials: true,
  });
};

// Récupérer un crédit spécifique
export const fetchCredit = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

// Créer un crédit
export const addCredit = async (creditData) => {
  return await axios.post(`${API_URL}`, creditData, {
    withCredentials: true,
  });
};

// Mettre à jour un crédit
export const editCredit = async (creditData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${creditData.id}`,
      creditData,
      {
        withCredentials: true,
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
  return await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

// Ajouter un paiement sur un crédit
export const addPayment = async (id, paymentData) => {
  return await axios.post(`${API_URL}/${id}/payment`, paymentData, {
    withCredentials: true,
  });
};

export const updateStatus = async (id, status) => {
  return await axios.patch(
    `${API_URL}/${id}`,
    { status },
    {
      withCredentials: true,
    }
  );
};

export const deletePayment = async (creditId, paymentId) => {
  return await axios.delete(`${API_URL}/${creditId}/payment/${paymentId}`, {
    withCredentials: true,
  });
};

import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/credits`;

export const fetchCredits = async () => {
  return await axios.get(`${API_URL}/user`, {
    withCredentials: true,
  });
};

export const fetchCredit = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const addCredit = async (creditData) => {
  return await axios.post(`${API_URL}`, creditData, {
    withCredentials: true,
  });
};

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

export const deleteCredit = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

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

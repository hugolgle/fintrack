import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/epargns`;

export const fetchAccounts = async () => {
  return await axios.get(`${API_URL}/accounts/user`, {
    withCredentials: true,
  });
};

export const fetchAccount = async (id) => {
  return await axios.get(`${API_URL}/accounts/${id}`, {
    withCredentials: true,
  });
};

export const addAccount = async (accountData) => {
  return await axios.post(`${API_URL}/accounts`, accountData, {
    withCredentials: true,
  });
};

export const editAccount = async (accountData) => {
  try {
    const response = await axios.put(
      `${API_URL}/accounts/${accountData.id}`,
      accountData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du compte :", error);
    throw error;
  }
};

export const addTransfer = async (transferData) => {
  const response = await axios.post(`${API_URL}/transfers`, transferData, {
    withCredentials: true,
  });
  return response.data;
};

export const interestAccount = async (interestData) => {
  const response = await axios.post(`${API_URL}/interest`, interestData, {
    withCredentials: true,
  });
  return response.data;
};

export const depositAccount = async (depositData) => {
  const response = await axios.post(`${API_URL}/deposit`, depositData, {
    withCredentials: true,
  });
  return response.data;
};

export const withdrawAccount = async (withdrawData) => {
  const response = await axios.post(`${API_URL}/withdraw`, withdrawData, {
    withCredentials: true,
  });
  return response.data;
};

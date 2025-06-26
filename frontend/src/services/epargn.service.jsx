import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}/epargns`;

export const fetchAccounts = async () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  return await axios.get(`${API_URL}/accounts/user/${userId}`, {
    withCredentials: true,
  });
};

export const fetchAccount = async (id) => {
  const token = sessionStorage.getItem("token");
  return await axios.get(`${API_URL}/accounts/${id}`, {
    withCredentials: true,
  });
};

export const addAccount = async (accountData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const newAccountData = {
    user: userId,
    ...accountData,
  };

  return await axios.post(`${API_URL}/accounts`, newAccountData, {
    withCredentials: true,
  });
};

export const editAccount = async (accountData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const newAccountData = {
    user: userId,
    ...accountData,
  };

  try {
    const response = await axios.put(
      `${API_URL}/accounts/${accountData.id}`,
      newAccountData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du compte :", error);
    throw error;
  }
};

export const addTransfer = async (transferData) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${API_URL}/transfers`, transferData, {
    withCredentials: true,
  });
  return response.data;
};

export const calculateInterests = async () => {
  return await axios.post(`${API_URL}/accounts/calculate-interest`);
};

export const depositAccount = async (depositData) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${API_URL}/deposit`, depositData, {
    withCredentials: true,
  });
  return response.data;
};

export const withdrawAccount = async (withdrawData) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${API_URL}/withdraw`, withdrawData, {
    withCredentials: true,
  });
  return response.data;
};

import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5001/epargns";

export const fetchAccounts = async () => {
  const token = sessionStorage.getItem("token");
  return await axios.get(`${API_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTransfer = async (transferData) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(`${API_URL}/transfers`, transferData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const calculateInterests = async () => {
  return await axios.post(`${API_URL}/accounts/calculate-interest`);
};

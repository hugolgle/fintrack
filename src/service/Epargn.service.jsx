import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5001/epargns";

export const fetchAccounts = async () => {
  const response = await axios.get(`${API_URL}/accounts`);
  return response.data;
};

export const addAccount = async (accountData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const newAccountData = {
    user: userId,
    ...accountData,
  };

  const response = await axios.post(`${API_URL}/accounts`, newAccountData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const transferBetweenAccounts = async (transferData) => {
  const response = await axios.post(
    `${API_URL}/accounts/transfer`,
    transferData
  );
  return response.data;
};

export const calculateInterests = async () => {
  const response = await axios.post(`${API_URL}/accounts/calculate-interest`);
  return response.data;
};

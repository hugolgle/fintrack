import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}/transactions`;

export const fetchTransactions = async () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  return await axios.get(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchTransactionById = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTransaction = async (transactionData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const { title, category, date, detail, amount, type, tag, group } =
    transactionData;

  const newTransaction = {
    user: userId,
    title,
    category,
    date,
    detail,
    amount,
    type,
    tag: tag || [],
    group,
  };

  return await axios.post(`${API_URL}`, newTransaction, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editTransactions = async (editData) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const { id, title, category, date, detail, amount, type, tag, group } =
    editData;

  const updatedTransaction = {
    title,
    category,
    date,
    detail,
    amount,
    type,
    tag: tag || [],
    group,
  };

  return await axios.put(`${API_URL}/${id}`, updatedTransaction, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTransactions = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addRefund = async (transactionId, refundData) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const { title, amount, date } = refundData;

  const newRefund = {
    title,
    amount,
    date,
  };

  return await axios.post(`${API_URL}/${transactionId}/refund`, newRefund, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

import axios from "axios";
import { jwtDecode } from "jwt-decode";

const getUserIdFromToken = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id;
  } catch (error) {
    throw new Error("Erreur lors du décodage du token.");
  }
};

export const fetchTransactions = async () => {
  const userId = getUserIdFromToken();
  const token = sessionStorage.getItem("token");

  return await axios.get(`http://localhost:5001/transactions/user/${userId}`, {
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

  return await axios.get(`http://localhost:5001/transactions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTransaction = async (transactionData) => {
  const userId = getUserIdFromToken();
  const token = sessionStorage.getItem("token");

  const { title, category, date, detail, amount, type } = transactionData;

  const newTransaction = {
    user: userId,
    title,
    category,
    date,
    detail,
    amount,
    type,
  };

  return await axios.post(
    `http://localhost:5001/transactions`,
    newTransaction,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const editTransactions = async (editData) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const { id, title, category, date, detail, amount, type } = editData;

  const updatedTransaction = {
    title,
    category,
    date,
    detail,
    amount,
    type,
  };

  return await axios.put(
    `http://localhost:5001/transactions/${id}`,
    updatedTransaction,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteTransactions = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.delete(`http://localhost:5001/transactions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

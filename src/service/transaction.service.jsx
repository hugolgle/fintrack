import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const fetchTransactions = async () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

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

  return await axios.post(
    `http://localhost:5001/transactions/${transactionId}/refund`,
    newRefund,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

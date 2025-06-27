import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/transactions`;

export const fetchTransactions = async () => {
  return await axios.get(`${API_URL}/user`, {
    withCredentials: true,
  });
};

export const fetchTransactionById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const addTransaction = async (transactionData) => {
  const { title, category, date, detail, amount, type, tag, group } =
    transactionData;

  const newTransaction = {
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
    withCredentials: true,
  });
};

export const editTransactions = async (editData) => {
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
    withCredentials: true,
  });
};

export const deleteTransactions = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const addRefund = async (transactionId, refundData) => {
  const { title, amount, date } = refundData;

  const newRefund = {
    title,
    amount,
    date,
  };

  return await axios.post(`${API_URL}/${transactionId}/refund`, newRefund, {
    withCredentials: true,
  });
};

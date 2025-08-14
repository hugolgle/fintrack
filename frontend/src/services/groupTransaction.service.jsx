import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/group-transactions`;

export const fetchGroupTransactions = async () => {
  return await axios.get(`${API_URL}/user`, {
    withCredentials: true,
  });
};

export const fetchGroupTransactionById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const addGroupTransaction = async (groupTransactionData) => {
  const { name, description, transactionIds = [] } = groupTransactionData;

  const newGroupTransaction = {
    name,
    description,
    transactions: transactionIds,
  };

  return await axios.post(`${API_URL}`, newGroupTransaction, {
    withCredentials: true,
  });
};

export const deleteGroupTransaction = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const editGroupTransaction = async (id, groupTransactionData) => {
  return await axios.put(`${API_URL}/${id}`, groupTransactionData, {
    withCredentials: true,
  });
};

export const addTransactionToGroup = async (id, transactionId) => {
  return await axios.post(
    `${API_URL}/${id}/transactions`,
    { transactionId },
    {
      withCredentials: true,
    }
  );
};

export const removeTransactionFromGroup = async (id, transactionId) => {
  return await axios.delete(`${API_URL}/${id}/transactions`, {
    data: { transactionId },
    withCredentials: true,
  });
};

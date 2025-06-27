import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/investments`;

export const fetchInvestments = async () => {
  return await axios.get(`${API_URL}/user`, {
    withCredentials: true,
  });
};

export const fetchInvestmentById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const addInvestment = async (investmentData) => {
  const { name, symbol, type, transaction } = investmentData;

  const newInvestment = {
    name,
    type,
    symbol,
    transaction: {
      amount: transaction.amount,
      date: transaction.date,
      isSale: transaction.action === "true",
    },
  };

  return await axios.post(`${API_URL}`, newInvestment, {
    withCredentials: true,
  });
};

export const addTransaction = async (investmentId, transactionData) => {
  const { amount, date, action } = transactionData;
  const newTransaction = {
    amount,
    date,
    isSale: action,
  };

  return await axios.post(
    `${API_URL}/${investmentId}/transaction`,
    newTransaction,
    {
      withCredentials: true,
    }
  );
};

export const editInvestments = async (editData) => {
  const { id, name, symbol, type } = editData;

  const updatedInvestment = {
    name,
    symbol,
    type,
  };

  return await axios.put(`${API_URL}/${id}`, updatedInvestment, {
    withCredentials: true,
  });
};

export const editInvestmentsTransaction = async (editData, idInvestment) => {
  const { id, date, amount } = editData;

  const updatedTransaction = {
    date,
    amount,
  };

  return await axios.put(
    `${API_URL}/${idInvestment}/transaction/${id}`,
    updatedTransaction,
    {
      withCredentials: true,
    }
  );
};

export const deleteTransaction = async (id) => {
  return await axios.delete(
    `${API_URL}/${id.idInvest}/transaction/${id.itemId}`,
    {
      withCredentials: true,
    }
  );
};

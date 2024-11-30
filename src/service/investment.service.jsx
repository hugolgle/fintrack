import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const fetchInvestments = async () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  return await axios.get(`http://localhost:5001/investments/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchInvestmentById = async (id) => {
  const token = sessionStorage.getItem("token");

  return await axios.get(`http://localhost:5001/investments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addInvestment = async (investmentData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const { name, symbol, type } = investmentData;

  const newInvestment = {
    user: userId,
    name,
    type,
    symbol,
  };

  return await axios.post(`http://localhost:5001/investments`, newInvestment, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTransaction = async (investmentId, transactionData) => {
  const token = sessionStorage.getItem("token");

  const { amount, date, action } = transactionData;
  const newTransaction = {
    amount,
    date,
    isSale: action,
  };

  return await axios.post(
    `http://localhost:5001/investments/${investmentId}/transaction`,
    newTransaction,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const editInvestments = async (editData) => {
  const token = sessionStorage.getItem("token");
  const { id, name, symbol, type } = editData;

  const updatedInvestment = {
    name,
    symbol,
    type,
  };

  return await axios.put(
    `http://localhost:5001/investments/${id}`,
    updatedInvestment,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const editInvestmentsTransaction = async (editData, idInvestment) => {
  const token = sessionStorage.getItem("token");
  const { id, date, amount } = editData;

  const updatedTransaction = {
    date,
    amount,
  };

  return await axios.put(
    `http://localhost:5001/investments/${idInvestment}/transaction/${id}`,
    updatedTransaction,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteInvestment = async (id) => {
  const token = sessionStorage.getItem("token");

  return await axios.delete(`http://localhost:5001/investments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTransaction = async (investmentId, transactionId) => {
  const token = sessionStorage.getItem("token");

  return await axios.delete(
    `http://localhost:5001/investments/${investmentId}/transaction/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

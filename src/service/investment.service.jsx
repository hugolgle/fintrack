import axios from "axios";

export const fetchInvestments = async (userId) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.get(`http://localhost:5001/investments/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchInvestmentById = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.get(`http://localhost:5001/investments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addInvestment = async (investmentData, userId) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const { title, date, detail, amount, type } = investmentData;

  // Formatage des données si nécessaire
  const newInvestment = {
    user: userId,
    title,
    date,
    detail,
    amount,
    type,
  };

  return await axios.post(`http://localhost:5001/investments`, newInvestment, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editInvestments = async (editData) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const { id, title, date, detail, amount, type } = editData;

  const updatedInvestment = {
    title,
    date,
    detail,
    amount,
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

export const deleteInvestments = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.delete(`http://localhost:5001/investments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

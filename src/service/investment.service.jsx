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

export const fetchInvestments = async () => {
  const token = sessionStorage.getItem("token");
  const userId = getUserIdFromToken();

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
  const userId = getUserIdFromToken();

  const { title, date, detail, amount, type } = investmentData;

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

  return await axios.delete(`http://localhost:5001/investments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

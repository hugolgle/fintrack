import axios from "axios";

// Fonction pour récupérer toutes les investments d'un utilisateur
export const fetchInvestments = async (userId) => {
  return await axios.get(`http://localhost:5001/investments/user/${userId}`);
};

// Fonction pour récupérer une transaction par ID
export const fetchInvestmentById = async (id) => {
  return await axios.get(`http://localhost:5001/investments/${id}`);
};

// Fonction pour ajouter une nouvelle transaction
export const addInvestment = async (investmentData, userId) => {
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

  return await axios.post(`http://localhost:5001/investments`, newInvestment);
};

// Fonction pour modifier une transaction existante
export const editInvestments = async (editData) => {
  const { id, title, date, detail, amount, type } = editData;

  // Formatage des données si nécessaire
  const updatedInvestment = {
    title,
    date,
    detail,
    amount,
    type,
  };

  return await axios.put(
    `http://localhost:5001/investments/${id}`,
    updatedInvestment
  );
};

// Fonction pour supprimer une transaction par ID
export const deleteInvestments = async (id) => {
  return await axios.delete(`http://localhost:5001/investments/${id}`);
};

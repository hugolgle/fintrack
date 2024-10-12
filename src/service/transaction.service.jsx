import axios from "axios";

// Fonction pour récupérer toutes les transactions d'un utilisateur
export const fetchTransactions = async (userId) => {
  return await axios.get(`http://localhost:5001/transactions/user/${userId}`);
};

// Fonction pour récupérer une transaction par ID
export const fetchTransactionById = async (id) => {
  return await axios.get(`http://localhost:5001/transactions/${id}`);
};

// Fonction pour ajouter une nouvelle transaction
export const addTransaction = async (transactionData, userId) => {
  const { title, category, date, detail, amount, type } = transactionData;

  // Formatage des données si nécessaire
  const newTransaction = {
    user: userId,
    title,
    category,
    date,
    detail,
    amount,
    type,
  };

  return await axios.post(`http://localhost:5001/transactions`, newTransaction);
};

// Fonction pour modifier une transaction existante
export const editTransactions = async (editData) => {
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
    updatedTransaction
  );
};

// Fonction pour supprimer une transaction par ID
export const deleteTransactions = async (id) => {
  return await axios.delete(`http://localhost:5001/transactions/${id}`);
};

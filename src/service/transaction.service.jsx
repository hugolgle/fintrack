import axios from "axios";

export const fetchTransactions = async (userId) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.get(`http://localhost:5001/transactions/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Préfixer le token avec "Bearer "
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

export const addTransaction = async (transactionData, userId) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

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

// Fonction pour modifier une transaction existante
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

// Fonction pour supprimer une transaction par ID
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

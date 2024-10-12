import { subMonths, startOfMonth } from "date-fns";

export const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
export const getCurrentDate = `${currentYear}-${month}-${day}`;

export function getCurrentMonth() {
  const month = currentMonth + 1;

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  return `${currentYear}${formattedMonth}`;
}

// -------------------------------- Transactions

export function getTransactionsByType(data, type, filterCategory, filterTitle) {
  if (!Array.isArray(data)) {
    return [];
  }

  let filteredTransactions = type
    ? data?.filter((transaction) => transaction.type === type)
    : data;

  if (filterCategory && filterCategory.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      filterCategory.includes(transaction.category)
    );
  }

  if (filterTitle && filterTitle.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      filterTitle.includes(transaction.title)
    );
  }

  return filteredTransactions.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getTransactionById(data, id) {
  if (!Array.isArray(data)) {
    return [];
  }

  if (id) {
    return data?.find((transaction) => transaction._id === id);
  } else {
    return null;
  }
}

export function getTransactionsByMonth(
  data,
  month,
  type,
  filterCategory,
  filterTitle
) {
  const targetMonth = `${month.slice(0, 4)}-${month.slice(4)}`;

  if (!Array.isArray(data)) {
    return [];
  }

  let transactionsInMonth = data?.filter((transaction) => {
    const transactionDate = transaction.date.split("T")[0];
    const transactionMonth = transactionDate.slice(0, 7);

    return transactionMonth === targetMonth;
  });

  if (type) {
    transactionsInMonth = transactionsInMonth.filter(
      (transaction) => transaction.type === type
    );
  }

  if (filterCategory && filterCategory.length > 0) {
    transactionsInMonth = transactionsInMonth.filter((transaction) =>
      filterCategory.includes(transaction.category)
    );
  }

  if (filterTitle && filterTitle.length > 0) {
    transactionsInMonth = transactionsInMonth.filter((transaction) =>
      filterTitle.includes(transaction.title)
    );
  }

  transactionsInMonth.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return transactionsInMonth;
}

export function getTransactionsByYear(
  data,
  year,
  type,
  filterCategory,
  filterTitle
) {
  if (!Array.isArray(data)) {
    return [];
  }

  let transactionsInYear = data?.filter((transaction) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  if (type) {
    transactionsInYear = transactionsInYear.filter(
      (transaction) => transaction.type === type
    );
  }

  if (filterCategory && filterCategory.length > 0) {
    transactionsInYear = transactionsInYear.filter((transaction) =>
      filterCategory.includes(transaction.category)
    );
  }

  if (filterTitle && filterTitle.length > 0) {
    transactionsInYear = transactionsInYear.filter((transaction) =>
      filterTitle.includes(transaction.title)
    );
  }

  transactionsInYear.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return transactionsInYear;
}

export function getLastTransactionsByType(data, type, number, month) {
  if (!Array.isArray(data)) {
    return [];
  }
  let filteredTransactions = data;

  if (type !== null) {
    filteredTransactions = data?.filter(
      (transaction) => transaction.type === type
    );
  }

  if (month) {
    const getCurrentMonthAndYear = () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      return { month: currentMonth, year: currentYear };
    };

    const { month: currentMonth, year: currentYear } = getCurrentMonthAndYear();
    filteredTransactions = filteredTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
  }

  // Sort by createdAt date first, then by date
  filteredTransactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Slice the sorted transactions to get the required number of last transactions
  const lastTransactions = filteredTransactions.slice(0, number);

  return lastTransactions;
}

export function getLastSubscribe(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  // Helper function to get the start date (31 days ago) and end date (today)
  const getDateRange = () => {
    const currentDate = new Date();

    // Start date: 31 days ago
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 31);

    // End date: today (current date)
    const endDate = currentDate;

    return {
      startDate: startDate.toISOString().split("T")[0], // Format YYYY-MM-DD
      endDate: endDate.toISOString().split("T")[0], // Format YYYY-MM-DD
    };
  };

  const { startDate, endDate } = getDateRange();

  // Step 1: Filter transactions for the category 'Abonnement'
  let filteredTransactions = data?.filter(
    (transaction) => transaction.category === "Abonnement"
  );

  // Step 2: Filter for transactions between the start date and end date
  filteredTransactions = filteredTransactions.filter((transaction) => {
    const transactionDate = transaction.date; // already in YYYY-MM-DD format
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Step 3: Return the filtered transactions as is (without removing duplicates)
  const lastSubscriptions = filteredTransactions.map((transaction) => ({
    title: transaction.title,
    date: transaction.date, // Keeping the date as it is (string)
    amount: transaction.amount,
  }));

  // Return all filtered transactions (even if there are duplicates)
  return lastSubscriptions;
}

// -------------------------------- Investissements

export function getAllInvestments(data, isSold) {
  if (!Array.isArray(data)) {
    return [];
  }
  const filteredInvestments =
    isSold !== null
      ? data?.filter((investment) => investment.isSold === isSold)
      : data;

  return filteredInvestments.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getInvestmentsByTitle(data, title) {
  if (!Array.isArray(data)) {
    return [];
  }
  if (title) {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, "");

    const filteredInvestments = data?.filter((investment) => {
      const investTitle = investment.title
        ? investment.title.toLowerCase().replace(/\s+/g, "")
        : "";
      return investTitle === formattedTitle;
    });

    return filteredInvestments;
  } else {
    return [];
  }
}

export function getInvestmentById(data, id) {
  if (!Array.isArray(data)) {
    return [];
  }
  if (id) {
    return data?.find((investment) => investment._id === id);
  } else {
    return null;
  }
}

// -------------------------------- Titles

export function getTitleOfTransactionsByType(data, type) {
  if (!Array.isArray(data)) {
    return [];
  }
  // Calculer la date de début des deux derniers mois
  const currentDate = new Date();
  const startDate = startOfMonth(subMonths(currentDate, 2));

  // Filtrer les transactions par type et par date
  const filteredTransactions = data?.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transaction.type === type && transactionDate >= startDate;
  });

  const titles = filteredTransactions.map((transaction) => transaction.title);

  // Tri des titles par ordre alphabétique
  const sortedTitles = titles.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  // Supprimer les doublons
  const uniqueTitles = Array.from(new Set(sortedTitles));

  return uniqueTitles;
}

// -------------------------------- Auto complete form

export function getLatestTransactionByTitle(data, title, type) {
  if (!Array.isArray(data)) {
    return [];
  }
  let filteredTransactions = type
    ? data?.filter((transaction) => transaction.type === type)
    : data;

  const filteredByTitle = filteredTransactions.filter(
    (transaction) => transaction.title === title
  );

  if (filteredByTitle.length === 0) return null;

  return filteredByTitle.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  })[0];
}

// -------------------------------- Chart

export function aggregateTransactions(transactions) {
  const totalMontant = transactions.reduce(
    (sum, transaction) => sum + Math.abs(transaction.amount),
    0
  );

  const montantParCategory = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount); // Assurer que le amount est positif
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  return Object.entries(montantParCategory).map(([category, amount]) => ({
    nomCate: category,
    amount: amount.toFixed(2), // Convertir le amount en chaîne de caractères avec deux décimales
    pourcentage: ((amount / totalMontant) * 100).toFixed(2), // Calculer le pourcentage et le formater
  }));
}

export function generateChartConfig(data) {
  const config = {};
  data?.forEach((item, index) => {
    const key = item.nomCate.replace(/\s+/g, "").toLowerCase();
    config[key] = {
      label: item.nomCate,
      color: `hsl(var(--chart-${(index % 20) + 1}))`, // Utiliser modulo pour boucler sur les 20 couleurs
    };
  });
  return config;
}

import { subMonths, startOfMonth } from "date-fns";
import { currentDate } from "./other";

// -------------------------------- Transactions

export function getTransactionsByType(data, type) {
  if (!Array.isArray(data)) {
    return [];
  }

  const filteredTransactions = type
    ? data?.filter((transaction) => transaction.type === type)
    : data;

  return filteredTransactions.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;
  });
}

export function getLastOperations(data, type, number, month) {
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
    const { month: currentMonth, year: currentYear } = currentDate();
    filteredTransactions = filteredTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
  }

  filteredTransactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastTransactions = filteredTransactions.slice(0, number);

  return lastTransactions;
}

// -------------------------------- Titles

export function getTitleOfTransactionsByType(data, type) {
  if (!Array.isArray(data)) {
    return [];
  }
  const currentDate = new Date();
  const startDate = startOfMonth(subMonths(currentDate, 2));

  const filteredTransactions = data?.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transaction.type === type && transactionDate >= startDate;
  });

  const uniqueTitles = Array.from(
    new Set(filteredTransactions.map((transaction) => transaction.title))
  );

  return uniqueTitles.sort((a, b) => a.localeCompare(b));
}

// -------------------------------- Tags

export function getTagsOfTransactions(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  const tags = data.flatMap((transaction) => transaction.tag);

  const uniqueTags = Array.from(new Set(tags));

  return uniqueTags;
}

// -------------------------------- Chart

export function aggregateTransactions(transactions) {
  const totalMontant = transactions.reduce(
    (sum, transaction) => sum + Math.abs(transaction.amount),
    0
  );

  const montantParCategory = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  return Object.entries(montantParCategory).map(([category, amount]) => ({
    nomCate: category,
    amount,
    pourcentage: (amount / totalMontant) * 100,
  }));
}

import { subMonths, startOfMonth } from "date-fns";
import { currentDate } from "./other";

// -------------------------------- Transactions

export function getTransactionsByType(
  data,
  type,
  filterCategory,
  filterTitle,
  filterTag
) {
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

  if (filterTag && filterTag.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.tag.some((tag) => filterTag.includes(tag))
    );
  }

  return filteredTransactions.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;
  });
}

export function getTransactionsByMonth(
  data,
  month,
  type,
  filterCategory,
  filterTitle,
  filterTag
) {
  if (!month || typeof month !== "string") {
    return [];
  }
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

  if (filterTag && filterTag.length > 0) {
    transactionsInMonth = transactionsInMonth.filter((transaction) =>
      transaction.tag.some((tag) => filterTag.includes(tag))
    );
  }

  transactionsInMonth.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;
  });

  return transactionsInMonth;
}

export function getTransactionsByYear(
  data,
  year,
  type,
  filterCategory,
  filterTitle,
  filterTag
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

  if (filterTag && filterTag.length > 0) {
    transactionsInYear = transactionsInYear.filter((transaction) =>
      transaction.tag.some((tag) => filterTag.includes(tag))
    );
  }

  transactionsInYear.sort((a, b) => {
    const dateSort = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateSort !== 0) return dateSort;
  });

  return transactionsInYear;
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
  const startDate = startOfMonth(subMonths(currentDate, 3));

  const filteredTransactions = data?.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transaction.type === type && transactionDate >= startDate;
  });

  const titles = filteredTransactions.map((transaction) => transaction.title);

  const uniqueTitles = Array.from(new Set(titles));

  return uniqueTitles;
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

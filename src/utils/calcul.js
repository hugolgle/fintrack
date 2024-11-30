import { format } from "date-fns";

export function calculTotal(data, type, filterCategory, filterTitle) {
  if (!Array.isArray(data)) {
    return [];
  }

  const filteredOperationsByType = data?.filter(
    (transaction) => transaction.type === type
  );

  const filteredOperationsByCategory =
    filterCategory && filterCategory.length > 0
      ? filteredOperationsByType.filter((transaction) =>
          filterCategory.includes(transaction.category)
        )
      : filteredOperationsByType;

  const filteredOperationsByTitle =
    filterTitle && filterTitle.length > 0
      ? filteredOperationsByCategory.filter((transaction) =>
          filterTitle.includes(transaction.title)
        )
      : filteredOperationsByCategory;

  const totalAmount = filteredOperationsByTitle.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0.0
  );

  const formattedTotal = totalAmount.toFixed(2);
  return formattedTotal;
}

export function calculTotalByMonth(
  data,
  type,
  month,
  filterCategory,
  filterTitle
) {
  if (!Array.isArray(data)) {
    return [];
  }

  const year = month.slice(0, 4);
  const monthNumber = month.slice(4);

  const filteredOperations = data?.filter((transaction) => {
    const transactionYear = transaction.date.slice(0, 4);
    const transactionMonth = transaction.date.slice(5, 7);
    return (
      transaction.type === type &&
      transactionYear === year &&
      transactionMonth === monthNumber
    );
  });

  const filteredOperationsByCategory =
    filterCategory && filterCategory.length > 0
      ? filteredOperations.filter((transaction) =>
          filterCategory.includes(transaction.category)
        )
      : filteredOperations;

  const filteredOperationsByTitle =
    filterTitle && filterTitle.length > 0
      ? filteredOperationsByCategory.filter((transaction) =>
          filterTitle.includes(transaction.title)
        )
      : filteredOperationsByCategory;

  const totalAmount = filteredOperationsByTitle.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0.0
  );

  const formattedTotal = totalAmount.toFixed(2);
  return formattedTotal;
}

export function calculTotalByYear(
  data,
  type,
  year,
  filterCategory,
  filterTitle
) {
  if (!Array.isArray(data)) {
    return [];
  }

  const filteredOperations = data?.filter((transaction) => {
    const transactionYear = format(transaction.date, "yyyy");
    return transaction.type === type && transactionYear === `${year}`;
  });

  const filteredOperationsByCategory =
    filterCategory && filterCategory.length > 0
      ? filteredOperations.filter((transaction) =>
          filterCategory.includes(transaction.category)
        )
      : filteredOperations;

  const filteredOperationsByTitle =
    filterTitle && filterTitle.length > 0
      ? filteredOperationsByCategory.filter((transaction) =>
          filterTitle.includes(transaction.title)
        )
      : filteredOperationsByCategory;

  const totalAmount = filteredOperationsByTitle.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0.0
  );

  const formattedTotal = totalAmount.toFixed(2);
  return formattedTotal;
}

export function calculMoyenne(data, type, year, nbMonth) {
  if (!Array.isArray(data) || nbMonth <= 0) {
    return "0.00";
  }

  let filteredOperations = data.filter((transaction) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  if (type) {
    filteredOperations = filteredOperations.filter((transaction) => {
      return transaction.type === type;
    });
  }

  const totalAmount = filteredOperations.reduce((acc, transaction) => {
    const amount = parseFloat(transaction.amount);
    return !isNaN(amount) ? acc + amount : acc;
  }, 0);

  const resultat = totalAmount / nbMonth;

  if (isNaN(resultat)) {
    return "0.00";
  }

  return resultat.toFixed(2);
}

export function calculEconomie(data, year, month) {
  if (!Array.isArray(data)) {
    return [];
  }

  let filteredOperations = data?.filter((transaction) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  if (month) {
    filteredOperations = filteredOperations.filter((transaction) => {
      const transactionMonth = transaction.date.slice(5, 7);
      return transactionMonth === month;
    });
  }

  let totalRecettes = 0;
  let totalDepenses = 0;

  filteredOperations.forEach((transaction) => {
    if (transaction.type === "Revenue") {
      totalRecettes += parseFloat(transaction.amount);
    } else if (transaction.type === "Expense") {
      totalDepenses += parseFloat(transaction.amount);
    }
  });

  const resultat = totalRecettes + totalDepenses;

  return resultat.toFixed(2);
}

export function calculMoyenneEconomie(depensesMoyennes, recettesMoyennes) {
  const depensesMoyennesString = String(depensesMoyennes || 0);
  const recettesMoyennesString = String(recettesMoyennes || 0);

  const depensesMoyennesNumber = parseFloat(
    depensesMoyennesString.replace(/\s/g, "").replace("€", "")
  );
  const recettesMoyennesNumber = parseFloat(
    recettesMoyennesString.replace(/\s/g, "").replace("€", "")
  );

  const economieMoyenne = recettesMoyennesNumber + depensesMoyennesNumber;

  const economieMoyenneFormatted = economieMoyenne.toFixed(2);
  return economieMoyenneFormatted;
}

export function calculInvestByMonth(data, date) {
  if (!Array.isArray(data)) {
    return [];
  }
  const targetYear = parseInt(date.slice(0, 4));
  const targetMonth = parseInt(date.slice(4, 6));

  const filteredInvestments = data?.filter((investment) => {
    const investDate = new Date(investment.date);
    const investMonth = investDate.getMonth() + 1;
    const investYear = investDate.getFullYear();

    return investMonth === targetMonth && investYear === targetYear;
  });

  const totalAmount = filteredInvestments.reduce((total, investment) => {
    return total + parseFloat(investment.amount || 0);
  }, 0.0);

  const formattedTotal = totalAmount.toFixed(2);
  return formattedTotal;
}

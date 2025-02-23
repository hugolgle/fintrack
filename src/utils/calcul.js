import { format } from "date-fns";

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
    (total, transaction) => total + transaction.amount,
    0.0
  );

  return totalAmount;
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
    (total, transaction) => total + transaction.amount,
    0.0
  );

  return totalAmount;
}

export function calculTotalAmount(data) {
  let total = 0;

  data?.forEach((transaction) => {
    total += transaction.amount;
  });
  return total;
}

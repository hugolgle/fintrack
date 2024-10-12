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

  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

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

  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

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
    const transactionYear = transaction.date.slice(0, 4);
    return transaction.type === type && transactionYear === year;
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

  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculMoyenne(data, type, year, nbMonth) {
  // Check if the data is an array
  if (!Array.isArray(data) || nbMonth <= 0) {
    return "0.00 €"; // Return default if input is invalid
  }

  // Filter transactions based on year
  let filteredOperations = data.filter((transaction) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  // If a type is provided, filter by type
  if (type) {
    filteredOperations = filteredOperations.filter((transaction) => {
      return transaction.type === type;
    });
  }

  // Calculate the total amount from filtered transactions
  const totalAmount = filteredOperations.reduce((acc, transaction) => {
    const amount = parseFloat(transaction.amount);
    return !isNaN(amount) ? acc + amount : acc; // Only add valid amounts
  }, 0);

  // Calculate the average
  const resultat = totalAmount / nbMonth;

  // Format the result
  if (isNaN(resultat)) {
    return "0.00 €"; // Return default if average calculation results in NaN
  }

  // Return formatted result
  return `${resultat.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;
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

  return resultat.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
export function calculMoyenneEconomie(depensesMoyennes, recettesMoyennes) {
  // Ensure the inputs are strings
  const depensesMoyennesString = String(depensesMoyennes || 0);
  const recettesMoyennesString = String(recettesMoyennes || 0);

  const depensesMoyennesNumber = parseFloat(
    depensesMoyennesString.replace(/\s/g, "").replace("€", "")
  );
  const recettesMoyennesNumber = parseFloat(
    recettesMoyennesString.replace(/\s/g, "").replace("€", "")
  );

  const economieMoyenne = recettesMoyennesNumber + depensesMoyennesNumber;

  const economieMoyenneFormatted = economieMoyenne
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return economieMoyenneFormatted;
}

// Investment

export function calculTotalInvestment(data, isSold, title) {
  if (!Array.isArray(data)) {
    return [];
  }
  // Filtrer les investissements par `isSold` et `title`
  const filteredOperations = data?.filter((investment) => {
    const matchSoldStatus =
      isSold !== null ? investment.isSold === isSold : true;
    const matchTitle = title
      ? investment.title.toLowerCase() === title.toLowerCase()
      : true;
    return matchSoldStatus && matchTitle;
  });

  // Calculer le amount total
  const totalAmount = filteredOperations.reduce((total, investment) => {
    if (isSold && investment.montantVendu !== undefined) {
      return total + parseFloat(investment.montantVendu);
    } else {
      return total + parseFloat(investment.amount);
    }
  }, 0.0);

  // Formater le total en ajoutant des espaces pour chaque millier et un symbole €
  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculTotalInvestmentByTitle(data, isSold, title) {
  if (!Array.isArray(data)) {
    return [];
  }
  // Convertir le title fourni en minuscules et supprimer les espaces
  const formattedTitle = title ? title.toLowerCase().replace(/\s+/g, "") : "";

  // Filtrer par title et par état (vendu ou non vendu)
  const filteredOperations = data?.filter((investment) => {
    const investTitle = investment.title
      ? investment.title.toLowerCase().replace(/\s+/g, "")
      : "";

    const titleMatches = !title || investTitle === formattedTitle;
    const soldMatches = isSold !== null ? investment.isSold === isSold : true;

    return titleMatches && soldMatches;
  });

  // Calculer le total des montants
  const totalAmount = filteredOperations.reduce((total, investment) => {
    if (isSold && investment.montantVendu !== undefined) {
      return total + parseFloat(investment.montantVendu);
    } else {
      return total + parseFloat(investment.amount);
    }
  }, 0.0);

  // Formater le total avec des espaces pour les milliers et ajouter "€"
  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculInvestByMonth(data, date) {
  if (!Array.isArray(data)) {
    return [];
  }
  // Extraire l'année et le mois du paramètre date (format YYYYMM)
  const targetYear = parseInt(date.slice(0, 4)); // Les 4 premiers caractères pour l'année
  const targetMonth = parseInt(date.slice(4, 6)); // Les 2 derniers caractères pour le mois (de 01 à 12)

  // Filtrer les investissements qui correspondent au mois et à l'année
  const filteredInvestments = data?.filter((investment) => {
    const investDate = new Date(investment.date); // La date de l'investissement en format "YYYY-MM-DD"
    const investMonth = investDate.getMonth() + 1; // Les mois en JS sont de 0 (janvier) à 11 (décembre), donc ajouter 1
    const investYear = investDate.getFullYear();

    return investMonth === targetMonth && investYear === targetYear;
  });

  // Calculer le total des montants pour le mois donné
  const totalAmount = filteredInvestments.reduce((total, investment) => {
    return total + parseFloat(investment.amount || 0);
  }, 0.0);

  // Formater le total avec des espaces pour les milliers et ajouter "€"
  const formattedTotal = totalAmount
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return formattedTotal;
}

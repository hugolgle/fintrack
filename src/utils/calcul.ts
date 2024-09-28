import { useSelector } from "react-redux";

export function calculTotal(type: any, filterCategorie: any, filterTitle: any) {
  const transactions = useSelector(
    (state: any) => state.transactionReducer || [],
  );

  const filteredOperationsByType = transactions.filter(
    (transaction: any) => transaction.type === type,
  );

  const filteredOperationsByCategory =
    filterCategorie && filterCategorie.length > 0
      ? filteredOperationsByType.filter((transaction: any) =>
          filterCategorie.includes(transaction.categorie),
        )
      : filteredOperationsByType;

  const filteredOperationsByTitle =
    filterTitle && filterTitle.length > 0
      ? filteredOperationsByCategory.filter((transaction: any) =>
          filterTitle.includes(transaction.titre),
        )
      : filteredOperationsByCategory;

  const totalAmount = filteredOperationsByTitle.reduce(
    (total: any, transaction: any) => total + parseFloat(transaction.montant),
    0.0,
  );

  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculTotalByMonth(
  type: any,
  month: string,
  filterCategorie: any,
  filterTitle: any,
) {
  const transactions = useSelector(
    (state: any) => state.transactionReducer || [],
  );

  const year = month.slice(0, 4);
  const monthNumber = month.slice(4);

  const filteredOperations = transactions.filter((transaction: any) => {
    const transactionYear = transaction.date.slice(0, 4);
    const transactionMonth = transaction.date.slice(5, 7);
    return (
      transaction.type === type &&
      transactionYear === year &&
      transactionMonth === monthNumber
    );
  });

  const filteredOperationsByCategory =
    filterCategorie && filterCategorie.length > 0
      ? filteredOperations.filter((transaction: any) =>
          filterCategorie.includes(transaction.categorie),
        )
      : filteredOperations;

  const filteredOperationsByTitle =
    filterTitle && filterTitle.length > 0
      ? filteredOperationsByCategory.filter((transaction: any) =>
          filterTitle.includes(transaction.titre),
        )
      : filteredOperationsByCategory;

  const totalAmount = filteredOperationsByTitle.reduce(
    (total: any, transaction: any) => total + parseFloat(transaction.montant),
    0.0,
  );

  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculTotalByYear(
  type: any,
  year: any,
  filterCategorie: any,
  filterTitle: any,
) {
  const transactions = useSelector(
    (state: any) => state.transactionReducer || [],
  );

  const filteredOperations = transactions.filter((transaction: any) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transaction.type === type && transactionYear === year;
  });

  const filteredOperationsByCategory =
    filterCategorie && filterCategorie.length > 0
      ? filteredOperations.filter((transaction: any) =>
          filterCategorie.includes(transaction.categorie),
        )
      : filteredOperations;

  const filteredOperationsByTitle =
    filterTitle && filterTitle.length > 0
      ? filteredOperationsByCategory.filter((transaction: any) =>
          filterTitle.includes(transaction.titre),
        )
      : filteredOperationsByCategory;

  const totalAmount = filteredOperationsByTitle.reduce(
    (total: any, transaction: any) => total + parseFloat(transaction.montant),
    0.0,
  );

  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculMoyenne(type: any, year: any, nbMonth: any) {
  const transactions = useSelector(
    (state: any) => state.transactionReducer || [],
  );

  let filteredOperations = transactions.filter((transaction: any) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  if (type) {
    filteredOperations = filteredOperations.filter((transaction: any) => {
      return transaction.type === type;
    });
  }

  const totalAmount = filteredOperations.reduce(
    (acc: number, transaction: any) => {
      return acc + parseFloat(transaction.montant);
    },
    0,
  );

  const resultat = totalAmount / parseFloat(nbMonth);

  if (isNaN(resultat)) {
    return "0.00 €";
  }

  return `${resultat.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;
}

export function calculEconomie(year: any, month: any) {
  const transactions = useSelector(
    (state: any) => state.transactionReducer || [],
  );

  let filteredOperations = transactions.filter((transaction: any) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  if (month) {
    filteredOperations = filteredOperations.filter((transaction: any) => {
      const transactionMonth = transaction.date.slice(5, 7);
      return transactionMonth === month;
    });
  }

  let totalRecettes = 0;
  let totalDepenses = 0;

  filteredOperations.forEach((transaction: any) => {
    if (transaction.type === "Recette") {
      totalRecettes += parseFloat(transaction.montant);
    } else if (transaction.type === "Dépense") {
      totalDepenses += parseFloat(transaction.montant);
    }
  });

  const resultat = totalRecettes + totalDepenses;

  return resultat.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
export function calculMoyenneEconomie(
  depensesMoyennes: any,
  recettesMoyennes: any,
) {
  const depensesMoyennesNumber = parseFloat(
    depensesMoyennes.replace(/\s/g, "").replace("€", ""),
  );
  const recettesMoyennesNumber = parseFloat(
    recettesMoyennes.replace(/\s/g, "").replace("€", ""),
  );

  const economieMoyenne = recettesMoyennesNumber + depensesMoyennesNumber;

  const economieMoyenneFormatted = economieMoyenne
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return economieMoyenneFormatted;
}

// Investment

export function calculTotalInvestment(
  isSold: boolean | null,
  title: any | null,
) {
  const investments = useSelector(
    (state: any) => state.investmentReducer || [],
  );

  // Filtrer les investissements par `isSold` et `title`
  const filteredOperations = investments.filter((investment: any) => {
    const matchSoldStatus =
      isSold !== null ? investment.isSold === isSold : true;
    const matchTitle = title
      ? investment.titre.toLowerCase() === title.toLowerCase()
      : true;
    return matchSoldStatus && matchTitle;
  });

  // Calculer le montant total
  const totalAmount = filteredOperations.reduce(
    (total: number, investment: any) => {
      if (isSold && investment.montantVendu !== undefined) {
        return total + parseFloat(investment.montantVendu);
      } else {
        return total + parseFloat(investment.montant);
      }
    },
    0.0,
  );

  // Formater le total en ajoutant des espaces pour chaque millier et un symbole €
  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculTotalInvestmentByTitle(
  isSold: boolean | null,
  title: string,
) {
  const investments = useSelector(
    (state: any) => state.investmentReducer || [],
  );

  // Convertir le titre fourni en minuscules et supprimer les espaces
  const formattedTitle = title ? title.toLowerCase().replace(/\s+/g, "") : "";

  // Filtrer par titre et par état (vendu ou non vendu)
  const filteredOperations = investments.filter((investment: any) => {
    const investTitle = investment.titre
      ? investment.titre.toLowerCase().replace(/\s+/g, "")
      : "";

    const titleMatches = !title || investTitle === formattedTitle;
    const soldMatches = isSold !== null ? investment.isSold === isSold : true;

    return titleMatches && soldMatches;
  });

  // Calculer le total des montants
  const totalAmount = filteredOperations.reduce(
    (total: number, investment: any) => {
      if (isSold && investment.montantVendu !== undefined) {
        return total + parseFloat(investment.montantVendu);
      } else {
        return total + parseFloat(investment.montant);
      }
    },
    0.0,
  );

  // Formater le total avec des espaces pour les milliers et ajouter "€"
  const formattedTotal = `${totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

  return formattedTotal;
}

export function calculInvestByMonth(date: any) {
  const investments = useSelector(
    (state: any) => state.investmentReducer || [],
  );

  // Extraire l'année et le mois du paramètre date (format YYYYMM)
  const targetYear = parseInt(date.slice(0, 4)); // Les 4 premiers caractères pour l'année
  const targetMonth = parseInt(date.slice(4, 6)); // Les 2 derniers caractères pour le mois (de 01 à 12)

  // Filtrer les investissements qui correspondent au mois et à l'année
  const filteredInvestments = investments.filter((investment: any) => {
    const investDate = new Date(investment.date); // La date de l'investissement en format "YYYY-MM-DD"
    const investMonth = investDate.getMonth() + 1; // Les mois en JS sont de 0 (janvier) à 11 (décembre), donc ajouter 1
    const investYear = investDate.getFullYear();

    return investMonth === targetMonth && investYear === targetYear;
  });

  // Calculer le total des montants pour le mois donné
  const totalAmount = filteredInvestments.reduce(
    (total: number, investment: any) => {
      return total + parseFloat(investment.montant || 0);
    },
    0.0,
  );

  // Formater le total avec des espaces pour les milliers et ajouter "€"
  const formattedTotal = totalAmount
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return formattedTotal;
}

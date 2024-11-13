import { currentDate, months } from "./other";

// ---------------------------------

export function Path(lePath, level) {
  if (lePath && lePath.pathname) {
    const path = lePath.pathname;
    const pathParts = path.split("/");
    return pathParts[level];
  } else {
    return null;
  }
}

export function addSpace(number) {
  const numStr = number != null ? number.toString() : "";

  if (typeof numStr !== "string") {
    return "";
  }

  const [integerPart, decimalPart] = numStr.split(".");

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " "
  );

  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
}

export function convertDate(code) {
  const annee = code.substring(0, 4);
  const moisNumero = parseInt(code.substring(4), 10);

  const nomMois = months[moisNumero - 1];

  return nomMois + " " + annee;
}

export function formatAmount(amount, type) {
  const montantNumerique =
    typeof amount === "number" ? amount : parseFloat(amount) || 0;
  const [partieEntiere, partieDecimale] = montantNumerique
    .toFixed(2)
    .split(".");

  const formattedAmount = `${partieEntiere}.${partieDecimale}`;

  if (type === "Expense") {
    return `-${formattedAmount}`;
  } else {
    return formattedAmount;
  }
}

export function formatAmountWithoutSpace(amount, toPositive) {
  const amountStr = `${amount}`;
  const formattedStr = amountStr.replace(/\s/g, "");

  if (toPositive) {
    return Math.abs(parseFloat(formattedStr));
  } else {
    return formattedStr;
  }
}

// Exemple d'utilisation
// const result = formatAmount("-1 543,25");
// console.log(result); // 1543.25

import { currentDate, months } from "./other";

const date = currentDate();
export const getCurrentDate = `${date.year}-${date.month}-${date.day}`;
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
  const numStr = typeof number === "number" ? number.toString() : number;

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

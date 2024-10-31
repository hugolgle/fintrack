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

export function formatDate(dateString, format) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (format === 1) {
    return `${day}/${month}/${year} à ${hours}h${minutes}`;
  } else if (format === 2) {
    const formattedMonth = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} ${formattedMonth} ${year}`;
  } else {
    throw new Error(
      "Format non reconnu. Utilisez 1 pour heures ou 2 pour lettres."
    );
  }
}

export function formatDateSlash(date) {
  const [year, month, day] = date.split("-");
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");

  return `${formattedDay}/${formattedMonth}/${year}`;
}

export function formatDateDayMonth(date) {
  const dateObj = new Date(date);
  const jourFormatte = String(dateObj.getDate()).padStart(2, "0");
  const moisFormatte = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${jourFormatte}/${moisFormatte}`;
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

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

const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
export const getCurrentDate = `${currentYear}-${month}-${day}`;

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

export function convertDateHour(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} à ${hours}h${minutes}`;
}

export function formatDate(date) {
  const [year, month, day] = date.split("-");

  const formattedDay = parseInt(day, 10);
  const formattedMonth = months[parseInt(month, 10) - 1];

  return `${formattedDay} ${formattedMonth} ${year}`;
}

export function formatDateBis(date) {
  const [year, month, day] = date.split("-");
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");

  return `${formattedDay}/${formattedMonth}/${year}`;
}

export function convertirFormatDate(date) {
  const dateObj = new Date(date);
  const jourFormatte = String(dateObj.getDate()).padStart(2, "0");
  const moisFormatte = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${jourFormatte}/${moisFormatte}`;
}

export function separateMillier(valeur) {
  const montantNumerique =
    typeof valeur === "number" ? valeur : parseFloat(valeur) || 0;
  const [partieEntiere, partieDecimale] = montantNumerique
    .toFixed(2)
    .split(".");
  return `${partieEntiere}.${partieDecimale}`;
}

export function formatMontant(montant, type) {
  if (type === "Dépense") {
    return `-${separateMillier(montant)}`;
  } else {
    return separateMillier(montant);
  }
}

export function getCurrentYearAndMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = (currentDate.getMonth() + 1).toString(); // Ajoute 1 car les mois sont indexés à partir de 0

  // Ajouter un '0' devant le mois si nécessaire (par exemple, 01, 02, ... 09)
  if (month.length < 2) {
    month = "0" + month;
  }

  // Retourne la date au format AAAAMM
  return `${year}${month}`;
}

export function retireSpace(nombre) {
  const nombreStr = nombre.toString();

  const resultat = nombreStr.replace(/\s/g, "");

  return parseFloat(resultat);
}

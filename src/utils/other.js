export const versionApp = import.meta.env.VITE_APP_VERSION;
import moment from "moment";

// -----------------------------

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

export const currentDate = () => {
  const theDate = moment();
  return {
    day: theDate.date().toString().padStart(2, "0"),
    month: (theDate.month() + 1).toString().padStart(2, "0"),
    year: theDate.year(),
  };
};

const date = currentDate();

// -----------------------------
export function getLastMonths(date, numberOfMonths) {
  const currentYear = parseInt(date.slice(0, 4), 10);
  const currentMonth = parseInt(date.slice(4, 6), 10) - 1;

  const lastMonths = [];

  for (let i = numberOfMonths - 1; i >= 0; i--) {
    let month = currentMonth - i;
    let year = currentYear;

    if (month < 0) {
      month += 12;
      year -= 1;
    }

    const formattedMonth = String(month + 1).padStart(2, "0");
    const monthInLetter = months[month];

    lastMonths.push({
      code: `${year}${formattedMonth}`,
      month: monthInLetter,
      year: year,
    });
  }

  return lastMonths;
}

export function getLastYears(number) {
  const lastYears = [];
  const currentYear = date.year;

  for (let i = number - 1; i >= 0; i--) {
    const year = currentYear - i;
    lastYears.push(year);
  }

  return lastYears;
}

export function categorySort(categories) {
  if (!Array.isArray(categories)) {
    throw new Error("Input must be an array");
  }
  return categories.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  });
}

export function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function nameType(typeBdd) {
  let name = "";
  switch (typeBdd) {
    case "Expense":
      name = "Dépense";
      break;
    case "Revenue":
      name = "Recette";
      break;
    default:
      name = "";
  }

  return name;
}

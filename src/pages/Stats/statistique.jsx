import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  calculEconomie,
  calculMoyenne,
  calculMoyenneEconomie,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../utils/calcul";
import { convertDate, months } from "../../utils/fonctionnel";
import { infoUser } from "../../utils/users";
import BoxStat from "../../composant/Box/boxStat";
import { CamembertStat } from "../../composant/Charts/camembertStat";
import { Separator } from "@/components/ui/separator";
import {
  getTransactionsByMonth,
  getTransactionsByYear,
} from "../../utils/operations";
import {
  categorieDepense,
  categorieRecette,
} from "../../../public/categories.json";
import Title from "../../composant/Text/title";
import { Button } from "@/components/ui/button";
import MainLayout from "../../layout/mainLayout";

export default function Statistique() {
  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    return { month: currentMonth, year: currentYear };
  };

  const userInfo = infoUser();
  const { month: currentMonth, year: currentYear } = getCurrentMonthAndYear();
  const [selectedMonth, setSelectedMonth] = useState(
    String(currentMonth).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [firstYear, setFirstYear] = useState(currentYear);
  const [filteredOperation, setFilteredOperation] = useState([]);

  const transactionReducer = useSelector((state) => state.transactionReducer);

  useEffect(() => {
    setFilteredOperation(transactionReducer);
  }, [transactionReducer]);

  useEffect(() => {
    const yearsSet = new Set();
    let minYear = currentYear;

    filteredOperation?.forEach((transaction) => {
      const year = new Date(transaction.date).getFullYear();
      if (transaction.user === userInfo.id) {
        yearsSet?.add(year);
        if (year < minYear) {
          minYear = year;
        }
      }
    });

    setFirstYear(minYear);
  }, [filteredOperation, userInfo.id, currentYear]);

  const clickMonth = (month) => {
    setSelectedMonth(month);
  };

  const clickYear = (year) => {
    setSelectedYear(year);
    if (year === currentYear) {
      setSelectedMonth(String(currentMonth).padStart(2, "0"));
    } else {
      setSelectedMonth("01");
    }
  };

  const [selectedByYear, setSelectedByYear] = useState(false);

  const handleByMonth = () => {
    setSelectedByYear(false);
  };

  const handleByYear = () => {
    setSelectedByYear(true);
  };

  const generateYears = () => {
    const years = [];
    for (let year = firstYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const generateMonths = () => {
    if (selectedYear === currentYear) {
      return Array.from({ length: currentMonth }, (_, i) => i + 1);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };
  const selectedDate = `${selectedYear}${selectedMonth}`;

  const depenseYear = calculTotalByYear(
    "Dépense",
    `${selectedYear}`,
    null,
    null
  );
  const recetteYear = calculTotalByYear(
    "Recette",
    `${selectedYear}`,
    null,
    null
  );

  const depenseMonth = calculTotalByMonth("Dépense", selectedDate, null, null);
  const recetteMonth = calculTotalByMonth("Recette", selectedDate, null, null);

  const nbMonth = generateMonths().length;

  const moyenneDepenseMois = calculMoyenne(
    "Dépense",
    `${selectedYear}`,
    nbMonth
  );
  const moyenneRecetteMois = calculMoyenne(
    "Recette",
    `${selectedYear}`,
    nbMonth
  );

  const economieTotale = calculEconomie(`${selectedYear}`, null);
  const economieMonth = calculEconomie(`${selectedYear}`, selectedMonth);
  const moyenneEconomie = calculMoyenneEconomie(
    moyenneDepenseMois,
    moyenneRecetteMois
  );

  return (
    <section className="w-full">
      <MainLayout title="Statistique" />
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-row gap-2">
          {generateYears().map((year, index) => (
            <Button
              variant="outline"
              className={`text-xs rounded-xl text-gray-500 hover:text-black hover:dark:text-white hover:bg-colorSecondaryLight hover:dark:bg-colorSecondaryDark ${
                selectedYear === year
                  ? "ring-1 ring-blue-400 text-black dark:text-white"
                  : ""
              }`}
              key={index}
              onClick={() => clickYear(year)}
            >
              {year}
            </Button>
          ))}
          <Separator orientation="vertical" className="h-7 my-auto" />
          <div className="flex w-full gap-2">
            {generateMonths().map((monthIndex, index) => (
              <Button
                variant="outline"
                className={`w-full text-xs rounded-xl text-gray-500 hover:text-black hover:dark:text-white hover:bg-colorSecondaryLight hover:dark:bg-colorSecondaryDark ${
                  selectedMonth === String(monthIndex).padStart(2, "0")
                    ? "ring-1 ring-blue-400 text-black dark:text-white"
                    : ""
                }`}
                key={index}
                onClick={() => clickMonth(String(monthIndex).padStart(2, "0"))}
              >
                {months[monthIndex - 1]}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-4 animate-fade">
          <div className="flex flex-col items-center gap-4 w-2/3">
            <div className="flex flex-row gap-4 w-full h-full text-right">
              <BoxStat
                type="Recette totale"
                selectedYear={selectedYear}
                montant={recetteYear}
              />
              <BoxStat
                type="Dépense totale"
                selectedYear={selectedYear}
                montant={depenseYear}
              />
              <BoxStat
                type="Économie totale"
                selectedYear={selectedYear}
                montant={`${economieTotale} €`}
              />
            </div>
            <div className="flex flex-row gap-4 w-full h-full text-right">
              <BoxStat
                type="Recette/Mois"
                selectedYear={selectedYear}
                montant={moyenneRecetteMois}
              />
              <BoxStat
                type="Dépense/Mois"
                selectedYear={selectedYear}
                montant={moyenneDepenseMois}
              />
              <BoxStat
                type="Économie/Mois"
                selectedYear={selectedYear}
                montant={`${moyenneEconomie} €`}
              />
            </div>
            <Separator className="w-5/6" />
            <div className="flex flex-row gap-4 text-right w-full h-full">
              <BoxStat
                type="Recette"
                months={months}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                montant={recetteMonth}
              />
              <BoxStat
                type="Dépense"
                months={months}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                montant={depenseMonth}
              />
              <BoxStat
                type={parseFloat(economieMonth) < 0 ? "Déficit" : "Économie"}
                selectedYear={selectedYear}
                montant={`${economieMonth} €`}
                months={months}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
          <Separator orientation="vertical" className="h-80 my-auto" />
          <div className="flex flex-col gap-4 w-1/3 text-right rounded-2xl items-center h-full">
            <p className="font-thin text-sm text-center p-2 rounded-2xl bg-colorSecondaryLight dark:bg-colorPrimaryDark w-full">
              Répartitions
            </p>
            <div className="flex flex-col w-full rounded-2xl  h-auto items-center p-4 bg-opacity-15 bg-green-600">
              <p className="italic font-thin text-center">
                {selectedByYear
                  ? `Recettes de ${selectedYear}`
                  : `Recettes de ${convertDate(selectedDate)}`}
              </p>

              <CamembertStat
                transactions={
                  selectedByYear
                    ? getTransactionsByYear(
                        `${selectedYear}`,
                        "Recette",
                        null,
                        null
                      )
                    : getTransactionsByMonth(
                        selectedDate,
                        "Recette",
                        null,
                        null
                      )
                }
                categorie={categorieRecette}
              />
            </div>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleByMonth}
                className={`font-thin italic w-full rounded-xl text-gray-500 hover:text-black hover:dark:text-white hover:bg-colorSecondaryLight hover:dark:bg-colorSecondaryDark ${!selectedByYear && "ring-1 ring-blue-400 text-black dark:text-white"}`}
              >
                {convertDate(selectedDate)}
              </Button>

              <Button
                variant="outline"
                onClick={handleByYear}
                className={`font-thin italic w-full rounded-xl text-gray-500 hover:text-black hover:dark:text-white hover:bg-colorSecondaryLight hover:dark:bg-colorSecondaryDark ${selectedByYear && "ring-1 ring-blue-400 text-black dark:text-white"}`}
              >
                {selectedYear}
              </Button>
            </div>

            <div className="flex flex-col w-full rounded-2xl  h-full items-center p-4 bg-opacity-15 bg-red-600">
              <p className="italic font-thin text-center">
                {selectedByYear
                  ? `Dépenses de ${selectedYear}`
                  : `Dépenses de ${convertDate(selectedDate)}`}
              </p>
              <CamembertStat
                transactions={
                  selectedByYear
                    ? getTransactionsByYear(
                        `${selectedYear}`,
                        "Dépense",
                        null,
                        null
                      )
                    : getTransactionsByMonth(
                        selectedDate,
                        "Dépense",
                        null,
                        null
                      )
                }
                categorie={categorieDepense}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

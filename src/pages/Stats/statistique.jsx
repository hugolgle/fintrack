import { useEffect, useState } from "react";
import {
  calculEconomie,
  calculMoyenne,
  calculMoyenneEconomie,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../utils/calcul";
import { convertDate } from "../../utils/fonctionnel";
import BoxStat from "../../composant/Box/boxStat";
import { CamembertStat } from "../../composant/Charts/camembertStat";
import { Separator } from "@/components/ui/separator";
import {
  getTransactionsByMonth,
  getTransactionsByYear,
} from "../../utils/operations";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import { Button } from "@/components/ui/button";
import { fetchTransactions } from "../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import Header from "../../composant/header";
import { useCurrentUser } from "../../hooks/user.hooks";
import Loader from "../../composant/loader/loader";
import { currentDate, months } from "../../utils/other";
import LoaderDots from "../../composant/loader/loaderDots";
import { useTheme } from "../../context/ThemeContext";

export default function Statistique() {
  const { data: userInfo } = useCurrentUser();
  const {
    data: transactionsData = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["fetchTransactions", userInfo?._id],
    queryFn: async () => {
      const response = await fetchTransactions(userInfo?._id);
      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }
      return response.data || [];
    },
    refetchOnMount: true,
  });

  const { month: currentMonth, year: currentYear } = currentDate();

  const [selectedMonth, setSelectedMonth] = useState(
    String(currentMonth).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [firstYear, setFirstYear] = useState(currentYear);
  const [filteredOperation, setFilteredOperation] = useState([]);
  const [selectedByYear, setSelectedByYear] = useState(false);

  useEffect(() => {
    if (!Array.isArray(transactionsData)) return;
    setFilteredOperation(transactionsData);
  }, [transactionsData]);

  useEffect(() => {
    const yearsSet = new Set();
    let minYear = currentYear;

    filteredOperation?.forEach((transaction) => {
      const year = new Date(transaction.date).getFullYear();
      if (transaction.user === userInfo?._id) {
        yearsSet?.add(year);
        if (year < minYear) {
          minYear = year;
        }
      }
    });

    setFirstYear(minYear);
  }, [filteredOperation, userInfo?._id, currentYear]);

  const clickMonth = (month) => {
    setSelectedMonth(month);
  };

  const clickYear = (year) => {
    setSelectedYear(year);
  };

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
    transactionsData,
    "Expense",
    `${selectedYear}`,
    null,
    null
  );
  const recetteYear = calculTotalByYear(
    transactionsData,
    "Revenue",
    `${selectedYear}`,
    null,
    null
  );

  const depenseMonth = calculTotalByMonth(
    transactionsData,
    "Expense",
    selectedDate,
    null,
    null
  );
  const recetteMonth = calculTotalByMonth(
    transactionsData,
    "Revenue",
    selectedDate,
    null,
    null
  );

  const nbMonth = generateMonths().length;

  const moyenneDepenseMois = calculMoyenne(
    transactionsData,
    "Expense",
    `${selectedYear}`,
    nbMonth
  );
  const moyenneRecetteMois = calculMoyenne(
    transactionsData,
    "Revenue",
    `${selectedYear}`,
    nbMonth
  );

  const economieTotale = calculEconomie(
    transactionsData,
    `${selectedYear}`,
    null
  );
  const economieMonth = calculEconomie(
    transactionsData,
    `${selectedYear}`,
    selectedMonth
  );
  const moyenneEconomie = calculMoyenneEconomie(
    moyenneDepenseMois,
    moyenneRecetteMois
  );

  if (isLoading) return <Loader />;

  const expensePieChartYear = getTransactionsByYear(
    transactionsData,
    `${selectedYear}`,
    "Expense",
    null,
    null
  );

  const expensePieChartMonth = getTransactionsByMonth(
    transactionsData,
    selectedDate,
    "Expense",
    null,
    null
  );

  const revenuePieChartYear = getTransactionsByYear(
    transactionsData,
    `${selectedYear}`,
    "Revenue",
    null,
    null
  );

  const revenuePieChartMonth = getTransactionsByMonth(
    transactionsData,
    selectedDate,
    "Revenue",
    null,
    null
  );

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  return (
    <section className="w-full">
      <Header title="Statistiques" isFetching={isFetching} />
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-row gap-2">
          {generateYears().map((year, index) => (
            <Button
              variant={selectedYear === year ? "secondary" : "none"}
              className="rounded-xl"
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
                variant={
                  selectedMonth === String(monthIndex).padStart(2, "0") &&
                  "secondary"
                }
                className="rounded-xl w-full"
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
                title="Recette totale"
                type="Revenue"
                selectedYear={selectedYear}
                amount={recetteYear}
              />
              <BoxStat
                title="Dépense totale"
                type="Expense"
                selectedYear={selectedYear}
                amount={depenseYear}
              />
              <BoxStat
                title="Économie totale"
                type="State"
                selectedYear={selectedYear}
                amount={`${economieTotale} €`}
              />
            </div>
            <div className="flex flex-row gap-4 w-full h-full text-right">
              <BoxStat
                title="Recette/Mois"
                type="Revenue"
                selectedYear={selectedYear}
                amount={moyenneRecetteMois}
              />
              <BoxStat
                title="Dépense/Mois"
                type="Expense"
                selectedYear={selectedYear}
                amount={moyenneDepenseMois}
              />
              <BoxStat
                title="Économie/Mois"
                type="State"
                selectedYear={selectedYear}
                amount={`${moyenneEconomie} €`}
              />
            </div>
            <Separator className="w-5/6" />
            <div className="flex flex-row gap-4 text-right w-full h-full">
              <BoxStat
                title="Recette"
                type="Revenue"
                months={months}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                amount={recetteMonth}
              />
              <BoxStat
                title="Dépense"
                type="Expense"
                months={months}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                amount={depenseMonth}
              />
              <BoxStat
                type="State"
                title={parseFloat(economieMonth) < 0 ? "Déficit" : "Économie"}
                selectedYear={selectedYear}
                amount={`${economieMonth} €`}
                months={months}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
          <Separator orientation="vertical" className="h-80 my-auto" />
          <div className="flex flex-col gap-4 w-1/3 text-right rounded-2xl items-center h-full">
            <p
              className={`w-full font-thin text-sm text-center p-2 rounded-2xl ${bgColor} w-full`}
            >
              Répartitions
            </p>
            <div
              className={`flex flex-col w-full rounded-2xl h-full items-center ${bgColor} p-4 ring-[3px] ring-green-500`}
            >
              <p className="italic font-thin text-center">
                {selectedByYear
                  ? `Recettes de ${selectedYear}`
                  : `Recettes de ${convertDate(selectedDate)}`}
              </p>

              {!isFetching ? (
                <CamembertStat
                  transactions={
                    selectedByYear ? revenuePieChartYear : revenuePieChartMonth
                  }
                  category={categoryRecette}
                />
              ) : (
                <LoaderDots size={180} />
              )}
            </div>

            <div className="flex gap-2 w-full">
              <Button
                variant={!selectedByYear ? "secondary" : "none"}
                onClick={handleByMonth}
                className="rounded-xl w-full"
              >
                {convertDate(selectedDate)}
              </Button>

              <Button
                variant={selectedByYear ? "secondary" : "none"}
                onClick={handleByYear}
                className="rounded-xl w-full"
              >
                {selectedYear}
              </Button>
            </div>

            <div
              className={`flex flex-col w-full rounded-2xl h-full items-center ${bgColor} p-4 ring-[3px] ring-red-500`}
            >
              <p className="italic font-thin text-center">
                {selectedByYear
                  ? `Dépenses de ${selectedYear}`
                  : `Dépenses de ${convertDate(selectedDate)}`}
              </p>
              {!isFetching ? (
                <CamembertStat
                  transactions={
                    selectedByYear ? expensePieChartYear : expensePieChartMonth
                  }
                  category={categoryDepense}
                />
              ) : (
                <LoaderDots />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import {
  calculEconomie,
  calculMoyenne,
  calculMoyenneEconomie,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../utils/calcul";
import BoxStat from "../../composant/Box/BoxStat";
import { Separator } from "@/components/ui/separator";
import {
  aggregateTransactions,
  getTransactionsByMonth,
  getTransactionsByYear,
} from "../../utils/operations";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import { Button } from "@/components/ui/button";
import { fetchTransactions } from "../../Service/Transaction.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../composant/Loader/Loader";
import { currentDate, months } from "../../utils/other";
import LoaderDots from "../../composant/Loader/LoaderDots";
import { HttpStatusCode } from "axios";
import { getUserIdFromToken } from "../../utils/users";
import { getCurrentUser } from "../../Service/User.service";
import { RadialChart } from "../../composant/Charts/RadialChart";
import { renderCustomLegend } from "../../composant/Legend";
import Header from "../../composant/Header";
import { useRef } from "react";

export default function Statistic() {
  const userId = getUserIdFromToken();

  const { data: dataUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  const {
    isLoading,
    data: dataTransactions,
    isFetching,
  } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
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

  const prevTransactionsRef = useRef();

  useEffect(() => {
    if (
      Array.isArray(dataTransactions) &&
      JSON.stringify(dataTransactions) !==
        JSON.stringify(prevTransactionsRef.current)
    ) {
      setFilteredOperation(dataTransactions);
      prevTransactionsRef.current = dataTransactions;
    }
  }, [dataTransactions]);

  useEffect(() => {
    const yearsSet = new Set();
    let minYear = currentYear;

    filteredOperation?.forEach((transaction) => {
      const year = new Date(transaction.date).getFullYear();
      if (transaction.user === dataUser?._id) {
        yearsSet?.add(year);
        if (year < minYear) {
          minYear = year;
        }
      }
    });

    setFirstYear(minYear);
  }, [filteredOperation, dataUser?._id, currentYear]);

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
    dataTransactions,
    "Expense",
    `${selectedYear}`,
    null,
    null
  );
  const recetteYear = calculTotalByYear(
    dataTransactions,
    "Revenue",
    `${selectedYear}`,
    null,
    null
  );

  const depenseMonth = calculTotalByMonth(
    dataTransactions,
    "Expense",
    selectedDate,
    null,
    null
  );
  const recetteMonth = calculTotalByMonth(
    dataTransactions,
    "Revenue",
    selectedDate,
    null,
    null
  );

  const nbMonth = generateMonths().length;

  const moyenneDepenseMois = calculMoyenne(
    dataTransactions,
    "Expense",
    `${selectedYear}`,
    nbMonth
  );
  const moyenneRecetteMois = calculMoyenne(
    dataTransactions,
    "Revenue",
    `${selectedYear}`,
    nbMonth
  );

  const economieTotale = calculEconomie(
    dataTransactions,
    `${selectedYear}`,
    null
  );
  const economieMonth = calculEconomie(
    dataTransactions,
    `${selectedYear}`,
    selectedMonth
  );
  const moyenneEconomie = calculMoyenneEconomie(
    moyenneDepenseMois,
    moyenneRecetteMois
  );

  if (isLoading) return <Loader />;

  const expensePieChartYear = getTransactionsByYear(
    dataTransactions,
    `${selectedYear}`,
    "Expense",
    null,
    null
  );

  const expensePieChartMonth = getTransactionsByMonth(
    dataTransactions,
    selectedDate,
    "Expense",
    null,
    null
  );

  const revenuePieChartYear = getTransactionsByYear(
    dataTransactions,
    `${selectedYear}`,
    "Revenue",
    null,
    null
  );

  const revenuePieChartMonth = getTransactionsByMonth(
    dataTransactions,
    selectedDate,
    "Revenue",
    null,
    null
  );

  const transactionsExpense = selectedByYear
    ? expensePieChartYear
    : expensePieChartMonth;

  const categoryColorsExpense = categoryDepense.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {});

  const chartDataExpense = aggregateTransactions(transactionsExpense);
  const totalAmountExpense = chartDataExpense.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const transformedDataExpense = chartDataExpense.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountExpense) * 100,
    fill: categoryColorsExpense[item.nomCate],
  }));

  const chartConfigExpense = {
    ...Object.keys(categoryColorsExpense).reduce((acc, category) => {
      acc[category.toLocaleLowerCase()] = {
        label: category,
        color: categoryColorsExpense[category],
      };
      return acc;
    }, {}),
  };

  const transactionsRevenue = selectedByYear
    ? revenuePieChartYear
    : revenuePieChartMonth;

  const categoryColorsRevenue = categoryRecette.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {});

  const chartDataRevenue = aggregateTransactions(transactionsRevenue);
  const totalAmountRevenue = chartDataRevenue.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const transformedDataRevenue = chartDataRevenue.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountRevenue) * 100,
    fill: categoryColorsRevenue[item.nomCate],
  }));

  const chartConfigRevenue = {
    ...Object.keys(categoryColorsRevenue).reduce((acc, category) => {
      acc[category.toLocaleLowerCase()] = {
        label: category,
        color: categoryColorsRevenue[category],
      };
      return acc;
    }, {}),
  };

  const convertDate = (date) => {
    const annee = Math.floor(date / 100);
    const mois = date % 100;
    return `${months[mois - 1]} ${annee}`;
  };

  return (
    <section className="w-full">
      <Header title="Statistiques" isFetching={isFetching} />
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-row gap-2">
          {generateYears().map((year, index) => (
            <Button
              variant={selectedYear === year ? "secondary" : "none"}
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
                className="w-full max-w-auto animate-fade"
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
                title="Revenu totale"
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
                amount={economieTotale}
              />
            </div>
            <div className="flex flex-row gap-4 w-full h-full text-right">
              <BoxStat
                title="Revenu/Mois"
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
                amount={moyenneEconomie}
              />
            </div>
            <Separator className="w-5/6" />
            <div className="flex flex-row gap-4 text-right w-full h-full">
              <BoxStat
                title="Revenu"
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
                title={economieMonth < 0 ? "Déficit" : "Économie"}
                selectedYear={selectedYear}
                amount={economieMonth}
                months={months}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
          <Separator orientation="vertical" className="h-80 my-auto" />
          <div className="flex flex-col gap-4 w-1/3 text-right rounded-2xl items-center h-full">
            <div className="flex flex-col w-full rounded-2xl h-full items-center p-4 ring-[2px] ring-green-500">
              <p className="italic font-thin text-center">
                {selectedByYear
                  ? `Revenus de ${selectedYear}`
                  : `Revenus de ${convertDate(selectedDate)}`}
              </p>

              {!isFetching ? (
                <RadialChart
                  chartData={transformedDataRevenue}
                  chartConfig={chartConfigRevenue}
                  legend={renderCustomLegend}
                  inner={40}
                  outer={55}
                  height={150}
                />
              ) : (
                <LoaderDots size={180} />
              )}
            </div>

            <div className="flex gap-2 w-full">
              <Button
                variant={!selectedByYear ? "secondary" : "none"}
                onClick={handleByMonth}
                className="w-full"
              >
                {convertDate(selectedDate)}
              </Button>

              <Button
                variant={selectedByYear ? "secondary" : "none"}
                onClick={handleByYear}
                className="w-full"
              >
                {selectedYear}
              </Button>
            </div>

            <div className="flex flex-col w-full rounded-2xl h-full items-center p-4 ring-[2px] ring-red-500">
              <p className="italic font-thin text-center">
                {selectedByYear
                  ? `Dépenses de ${selectedYear}`
                  : `Dépenses de ${convertDate(selectedDate)}`}
              </p>
              {!isFetching ? (
                <RadialChart
                  chartData={transformedDataExpense}
                  chartConfig={chartConfigExpense}
                  legend={renderCustomLegend}
                  inner={40}
                  outer={55}
                  height={150}
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

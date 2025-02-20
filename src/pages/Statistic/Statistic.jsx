import { useEffect, useState } from "react";
import {
  calculEconomie,
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
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
import { fetchInvestments } from "../../Service/Investment.service";

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

  const { data: dataInvests } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();
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
  console.log(selectedMonth);
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
    `${selectedYear}`
  );
  const recetteYear = calculTotalByYear(
    dataTransactions,
    "Revenue",
    `${selectedYear}`
  );

  const depenseMonth = calculTotalByMonth(
    dataTransactions,
    "Expense",
    selectedDate
  );

  const recetteMonth = calculTotalByMonth(
    dataTransactions,
    "Revenue",
    selectedDate
  );

  const nbMonth = generateMonths().length;

  const moyenneDepenseMois = depenseYear / nbMonth;
  const moyenneRecetteMois = recetteYear / nbMonth;

  // ---------

  const economieTotale = calculEconomie(dataTransactions, `${selectedYear}`);
  const economieMonth = calculEconomie(
    dataTransactions,
    `${selectedYear}`,
    selectedMonth
  );
  const moyenneEconomie = moyenneDepenseMois + moyenneRecetteMois;
  // ---------
  const amountInvestisYear = dataInvests
    ?.map((data) =>
      data.transaction
        .filter((transaction) => {
          return transaction.date.slice(0, 4) === `${selectedYear}`;
        })
        .reduce((total, item) => {
          return total + (item.amount || 0);
        }, 0)
    )
    .reduce((total, item) => {
      return total + (item || 0);
    }, 0);

  const AmountInvestisMonth = dataInvests
    ?.map((data) =>
      data.transaction
        .filter((transaction) => {
          return (
            transaction.date.slice(0, 7) === `${selectedYear}-${selectedMonth}`
          );
        })
        .reduce((total, item) => {
          return total + (item.amount || 0);
        }, 0)
    )
    .reduce((total, item) => {
      return total + (item || 0);
    }, 0);

  const amountInvestisAverage = amountInvestisYear / nbMonth;

  // ---------

  if (isLoading) return <Loader />;

  const expensePieChartYear = getTransactionsByYear(
    dataTransactions,
    `${selectedYear}`,
    "Expense"
  );

  const expensePieChartMonth = getTransactionsByMonth(
    dataTransactions,
    selectedDate,
    "Expense"
  );

  const revenuePieChartYear = getTransactionsByYear(
    dataTransactions,
    `${selectedYear}`,
    "Revenue"
  );

  const revenuePieChartMonth = getTransactionsByMonth(
    dataTransactions,
    selectedDate,
    "Revenue"
  );

  const categoryColorsExpense = categoryDepense.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {});

  const chartDataExpenseYear = aggregateTransactions(expensePieChartYear);
  const chartDataExpenseMonth = aggregateTransactions(expensePieChartMonth);

  const totalAmountExpenseYear = chartDataExpenseYear.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalAmountExpenseMonth = chartDataExpenseMonth.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const transformedDataExpenseYear = chartDataExpenseYear.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountExpenseYear) * 100,
    fill: categoryColorsExpense[item.nomCate],
  }));

  const transformedDataExpenseMonth = chartDataExpenseMonth.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountExpenseMonth) * 100,
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

  const categoryColorsRevenue = categoryRecette.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {});

  const chartDataRevenueMonth = aggregateTransactions(revenuePieChartMonth);
  const chartDataRevenueYear = aggregateTransactions(revenuePieChartYear);

  const totalAmountRevenueMonth = chartDataRevenueMonth.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalAmountRevenueYear = chartDataRevenueYear.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const transformedDataRevenueMonth = chartDataRevenueMonth.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountRevenueMonth) * 100,
    fill: categoryColorsRevenue[item.nomCate],
  }));

  const transformedDataRevenueYear = chartDataRevenueYear.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountRevenueYear) * 100,
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

  const years = generateYears().reverse();

  return (
    <section className="w-full">
      <Header title="Statistiques" isFetching={isFetching} />
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-row gap-2">
          <Carousel className="max-w-xs overflow-hidden">
            <CarouselContent className="flex gap-2 px-4 snap-x snap-mandatory">
              {years.map((year, index) => (
                <CarouselItem className="basis-1/2 pl-0">
                  <Button
                    variant={selectedYear === year ? "secondary" : "none"}
                    key={index}
                    onClick={() => clickYear(year)}
                    className="w-full"
                  >
                    {year}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Separator
            orientation="vertical"
            className="h-7 my-auto bg-secondary"
          />
          <div className="flex w-full gap-2">
            {generateMonths().map((monthIndex, index) => (
              <Button
                variant={
                  selectedMonth === String(monthIndex).padStart(2, "0")
                    ? "secondary"
                    : "none"
                }
                className="w-full max-w-fit animate-fade"
                key={index}
                onClick={() => clickMonth(String(monthIndex).padStart(2, "0"))}
              >
                {months[monthIndex - 1]}
              </Button>
            ))}
          </div>
        </div>
        <div className="bg-secondary/40 flex w-full rounded-2xl border">
          <div className="flex flex-col w-full p-4">
            <p className="italic font-thin text-left text-xs">
              Revenus de {selectedYear}
            </p>

            {!isFetching ? (
              <RadialChart
                chartData={transformedDataRevenueYear}
                chartConfig={chartConfigRevenue}
                legend={renderCustomLegend}
                inner={30}
                outer={45}
                height={110}
              />
            ) : (
              <LoaderDots size={180} />
            )}
          </div>
          <Separator
            orientation="vertical"
            className="h-32 my-auto bg-secondary"
          />
          <div className="flex flex-col w-full p-4">
            <p className="italic font-thin text-left text-xs">
              Dépenses {selectedYear}
            </p>
            {!isFetching ? (
              <RadialChart
                chartData={transformedDataExpenseYear}
                chartConfig={chartConfigExpense}
                legend={renderCustomLegend}
                inner={30}
                outer={45}
                height={110}
              />
            ) : (
              <LoaderDots />
            )}
          </div>
          <Separator
            orientation="vertical"
            className="h-32 my-auto bg-secondary"
          />
          <div className="flex flex-col w-full p-4">
            <p className="italic font-thin text-left text-xs">
              Revenus de {convertDate(selectedDate)}
            </p>

            {!isFetching ? (
              <RadialChart
                chartData={transformedDataRevenueMonth}
                chartConfig={chartConfigRevenue}
                legend={renderCustomLegend}
                inner={30}
                outer={45}
                height={110}
              />
            ) : (
              <LoaderDots size={180} />
            )}
          </div>
          <Separator
            orientation="vertical"
            className="h-32 my-auto bg-secondary"
          />
          <div className="flex flex-col w-full p-4">
            <p className="italic font-thin text-left text-xs">
              Dépenses de {convertDate(selectedDate)}
            </p>
            {!isFetching ? (
              <RadialChart
                chartData={transformedDataExpenseMonth}
                chartConfig={chartConfigExpense}
                legend={renderCustomLegend}
                inner={30}
                outer={45}
                height={110}
              />
            ) : (
              <LoaderDots />
            )}
          </div>
        </div>
        <div className="flex gap-4 animate-fade">
          <div className="flex flex-col items-center gap-4 w-2/3">
            <div className="flex flex-row gap-4 w-full h-full text-right">
              <div className="flex w-10 rounded-2xl justify-center items-center border bg-secondary/40 transition-all hover:bg-opacity-95">
                <h1 className="text-center italic text-xs w-fit h-fit -rotate-90">
                  Revenu
                </h1>
              </div>

              <BoxStat
                title="Revenu par Mois"
                type="Revenue"
                selectedYear={selectedYear}
                amount={moyenneRecetteMois}
              />
              <BoxStat
                title="Revenu"
                type="Revenue"
                months={months}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                amount={recetteMonth}
              />
              <BoxStat
                title="Revenu totale"
                type="Revenue"
                selectedYear={selectedYear}
                amount={recetteYear}
              />
            </div>
            <div className="flex flex-row gap-4 w-full h-full text-right">
              <div className="flex w-10 rounded-2xl justify-center items-center border bg-secondary/40 transition-all hover:bg-opacity-95">
                <h1 className="text-center italic text-xs w-fit h-fit -rotate-90">
                  Dépense
                </h1>
              </div>
              <BoxStat
                title="Dépense par Mois"
                type="Expense"
                selectedYear={selectedYear}
                amount={moyenneDepenseMois}
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
                title="Dépense totale"
                type="Expense"
                selectedYear={selectedYear}
                amount={depenseYear}
              />
            </div>
            <div className="flex flex-row gap-4 text-right w-full h-full">
              <div className="flex w-10 rounded-2xl justify-center items-center border bg-secondary/40 transition-all hover:bg-opacity-95">
                <h1 className="text-center italic text-xs w-fit h-fit -rotate-90">
                  Économie
                </h1>
              </div>
              <BoxStat
                title="Économie par Mois"
                type="State"
                selectedYear={selectedYear}
                amount={moyenneEconomie}
              />
              <BoxStat
                type="State"
                title={economieMonth < 0 ? "Déficit" : "Économie"}
                selectedYear={selectedYear}
                amount={economieMonth}
                months={months}
                selectedMonth={selectedMonth}
              />
              <BoxStat
                title="Économie totale"
                type="State"
                selectedYear={selectedYear}
                amount={economieTotale}
              />
            </div>
            <div className="flex flex-row gap-4 text-right w-full h-full">
              <div className="flex w-10 rounded-2xl justify-center items-center border bg-secondary/40 transition-all hover:bg-opacity-95">
                <h1 className="text-center italic text-xs w-fit h-fit -rotate-90">
                  Investissement
                </h1>
              </div>
              <BoxStat
                title="Investissement par Mois"
                type="State"
                selectedYear={selectedYear}
                amount={amountInvestisAverage}
              />
              <BoxStat
                type="State"
                title="Investissement"
                selectedYear={selectedYear}
                amount={AmountInvestisMonth}
                months={months}
                selectedMonth={selectedMonth}
              />
              <BoxStat
                title="Investissement totale"
                type="State"
                selectedYear={selectedYear}
                amount={amountInvestisYear}
              />
            </div>
          </div>
          <div className="bg-secondary/40 flex w-1/3 rounded-2xl border p-4">
            <h2 className="text-left">Récapitulatif</h2>
          </div>
        </div>
      </div>
    </section>
  );
}

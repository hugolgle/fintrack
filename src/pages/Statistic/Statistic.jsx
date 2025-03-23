import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { calculTotalByMonth, calculTotalByYear } from "../../utils/calcul";
import {
  aggregateTransactions,
  getTransactionsByType,
} from "../../utils/operations";
import { fetchTransactions } from "../../Service/Transaction.service";
import { fetchInvestments } from "../../Service/Investment.service";
import { getCurrentUser } from "../../Service/User.service";
import { getUserIdFromToken } from "../../utils/users";
import { currentDate, months } from "../../utils/other";
import { HttpStatusCode } from "axios";
import BoxStat from "../../composant/Box/BoxStat";
import Header from "../../composant/Header";
import Container from "../../composant/Container/Container";
import Loader from "../../composant/Loader/Loader";
import LoaderDots from "../../composant/Loader/LoaderDots";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadialChart } from "../../composant/Charts/RadialChart";
import { renderCustomLegend } from "../../composant/Legend";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import { toast } from "sonner";
import { TYPES } from "../../StaticData/StaticData";
import { formatCurrency } from "../../utils/fonctionnel";

export default function Statistic() {
  const userId = getUserIdFromToken();
  const { month: currentMonth, year: currentYear } = currentDate();

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
      if (response?.status !== HttpStatusCode.Ok)
        toast.warn(response?.response?.data?.message || "Erreur");
      return response?.data;
    },
    refetchOnMount: true,
  });

  const { data: dataInvests } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();
      if (response?.status !== HttpStatusCode.Ok)
        toast.warn(response?.response?.data?.message || "Erreur");
      return response?.data;
    },
    refetchOnMount: true,
  });

  const [selectedMonth, setSelectedMonth] = useState(
    String(currentMonth).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const firstYear = useMemo(() => {
    if (!dataTransactions || !dataUser) return currentYear;
    return dataTransactions.reduce((min, t) => {
      const year = new Date(t.date).getFullYear();
      return t.user === dataUser._id ? Math.min(min, year) : min;
    }, currentYear);
  }, [dataTransactions, dataUser, currentYear]);

  const years = useMemo(() => {
    const arr = [];
    for (let y = firstYear; y <= currentYear; y++) arr.push(y);
    return arr.reverse();
  }, [firstYear, currentYear]);

  const monthsList = useMemo(() => {
    const len = selectedYear === currentYear ? currentMonth : 12;
    return Array.from({ length: len }, (_, i) => i + 1);
  }, [selectedYear, currentYear, currentMonth]);

  const selectedDate = `${selectedYear}${selectedMonth}`;

  const depenseYear = useMemo(
    () => calculTotalByYear(dataTransactions, TYPES.EXPENSE, `${selectedYear}`),
    [dataTransactions, selectedYear]
  );
  const recetteYear = useMemo(
    () => calculTotalByYear(dataTransactions, TYPES.INCOME, `${selectedYear}`),
    [dataTransactions, selectedYear]
  );
  const depenseMonth = useMemo(
    () => calculTotalByMonth(dataTransactions, TYPES.EXPENSE, selectedDate),
    [dataTransactions, selectedDate]
  );
  const recetteMonth = useMemo(
    () => calculTotalByMonth(dataTransactions, TYPES.INCOME, selectedDate),
    [dataTransactions, selectedDate]
  );

  const nbMonth = monthsList.length;
  const moyenneDepenseMois = depenseYear / nbMonth;
  const moyenneRecetteMois = recetteYear / nbMonth;
  const economieTotale = recetteYear + depenseYear;
  const economieMonth = recetteMonth + depenseMonth;
  const moyenneEconomie = moyenneDepenseMois + moyenneRecetteMois;

  const amountInvestisYear = useMemo(() => {
    if (!dataInvests) return 0;
    return dataInvests.reduce((acc, d) => {
      const total = d.transaction
        .filter((t) => t.date.slice(0, 4) === `${selectedYear}`)
        .reduce((s, t) => s + (t.amount || 0), 0);
      return acc + total;
    }, 0);
  }, [dataInvests, selectedYear]);

  const amountInvestisMonth = useMemo(() => {
    if (!dataInvests) return 0;
    return dataInvests.reduce((acc, d) => {
      const total = d.transaction
        .filter(
          (t) => t.date.slice(0, 7) === `${selectedYear}-${selectedMonth}`
        )
        .reduce((s, t) => s + (t.amount || 0), 0);
      return acc + total;
    }, 0);
  }, [dataInvests, selectedYear, selectedMonth]);

  const amountInvestisAverage = amountInvestisYear / nbMonth;

  const dataRevenue = getTransactionsByType(dataTransactions, TYPES.INCOME);
  const dataExpense = getTransactionsByType(dataTransactions, TYPES.EXPENSE);

  const filterBy = (data, type) =>
    data.filter(
      (t) =>
        t.date.slice(0, type === "year" ? 4 : 7) ===
        (type === "year"
          ? `${selectedYear}`
          : `${selectedYear}-${selectedMonth}`)
    );

  const expensePieChartYear = filterBy(dataExpense, "year");
  const expensePieChartMonth = filterBy(dataExpense, "month");
  const revenuePieChartYear = filterBy(dataRevenue, "year");
  const revenuePieChartMonth = filterBy(dataRevenue, "month");

  const categoryColorsExpense = useMemo(
    () =>
      categoryDepense.reduce(
        (acc, cat) => ({ ...acc, [cat.name]: cat.color }),
        {}
      ),
    []
  );
  const categoryColorsRevenue = useMemo(
    () =>
      categoryRecette.reduce(
        (acc, cat) => ({ ...acc, [cat.name]: cat.color }),
        {}
      ),
    []
  );

  const chartDataExpenseYear = aggregateTransactions(expensePieChartYear);
  const chartDataExpenseMonth = aggregateTransactions(expensePieChartMonth);
  const totalAmountExpenseYear = chartDataExpenseYear.reduce(
    (s, i) => s + i.amount,
    0
  );
  const totalAmountExpenseMonth = chartDataExpenseMonth.reduce(
    (s, i) => s + i.amount,
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

  const chartConfigExpense = useMemo(() => {
    return Object.keys(categoryColorsExpense).reduce((acc, cat) => {
      acc[cat.toLowerCase()] = {
        label: cat,
        color: categoryColorsExpense[cat],
      };
      return acc;
    }, {});
  }, [categoryColorsExpense]);

  const chartDataRevenueMonth = aggregateTransactions(revenuePieChartMonth);
  const chartDataRevenueYear = aggregateTransactions(revenuePieChartYear);
  const totalAmountRevenueMonth = chartDataRevenueMonth.reduce(
    (s, i) => s + i.amount,
    0
  );
  const totalAmountRevenueYear = chartDataRevenueYear.reduce(
    (s, i) => s + i.amount,
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

  const chartConfigRevenue = useMemo(() => {
    return Object.keys(categoryColorsRevenue).reduce((acc, cat) => {
      acc[cat.toLowerCase()] = {
        label: cat,
        color: categoryColorsRevenue[cat],
      };
      return acc;
    }, {});
  }, [categoryColorsRevenue]);

  const convertDate = (date) => {
    const annee = Math.floor(date / 100);
    const mois = date % 100;
    return `${months[mois - 1]} ${annee}`;
  };

  const rest = economieMonth - amountInvestisMonth;

  const restYear = economieTotale - amountInvestisYear;

  const isCurrentDate = selectedDate === `${currentYear}${currentMonth}`;

  const isCurrentYear = selectedYear === currentYear;

  if (isLoading) return <Loader />;

  return (
    <section className="w-full">
      <Header title="Statistiques" isFetching={isFetching} />
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-row gap-2">
          <Carousel className="max-w-xs overflow-hidden">
            <CarouselContent className="flex gap-2 px-4 snap-x snap-mandatory">
              {years.map((year, i) => (
                <CarouselItem
                  key={i}
                  className={`pl-0 ${years.length > 1 && "basis-1/2"}`}
                >
                  <Button
                    variant={selectedYear === year ? "secondary" : "none"}
                    onClick={() => setSelectedYear(year)}
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
            {monthsList.map((m, i) => (
              <Button
                key={i}
                variant={
                  selectedMonth === String(m).padStart(2, "0")
                    ? "secondary"
                    : "none"
                }
                className="w-full max-w-fit animate-fade"
                onClick={() => setSelectedMonth(String(m).padStart(2, "0"))}
              >
                {months[m - 1]}
              </Button>
            ))}
          </div>
        </div>
        <Container custom="!flex-row">
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
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
            className="h-32 my-auto bg-secondary mr-4"
          />
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
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
            className="h-32 my-auto bg-secondary mr-4"
          />
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
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
            className="h-32 my-auto bg-secondary mr-4"
          />
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
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
        </Container>
        <div className="flex gap-4 animate-fade">
          <div className="flex flex-col items-center gap-4 w-2/3">
            <div className="flex flex-row gap-4 w-full text-right">
              <Container custom="!w-8" />
              <Container custom="!p-2">
                <h1 className="text-center italic text-xs">Moyenne/Mois</h1>
              </Container>
              <Container custom="!p-2">
                <h1 className="text-center italic text-xs">Par mois</h1>
              </Container>
              <Container custom="!p-2">
                <h1 className="text-center italic text-xs">Par an</h1>
              </Container>
            </div>
            <div className="flex flex-row gap-4 w-full text-right">
              <Container custom="!w-8 !justify-center items-center">
                <h1 className="text-center italic text-xs -rotate-90">
                  Revenu
                </h1>
              </Container>
              <BoxStat
                title="Revenu par Mois"
                type={TYPES.INCOME}
                selectedYear={selectedYear}
                amount={moyenneRecetteMois}
              />
              <BoxStat
                title="Revenu"
                type={TYPES.INCOME}
                months={months}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                amount={recetteMonth}
              />
              <BoxStat
                title="Revenu totale"
                type={TYPES.INCOME}
                selectedYear={selectedYear}
                amount={recetteYear}
              />
            </div>
            <div className="flex flex-row gap-4 w-full text-right">
              <Container custom="!w-8 !justify-center items-center">
                <h1 className="text-center italic text-xs -rotate-90">
                  Dépense
                </h1>
              </Container>
              <BoxStat
                title="Dépense par Mois"
                type={TYPES.EXPENSE}
                selectedYear={selectedYear}
                amount={moyenneDepenseMois}
              />
              <BoxStat
                title="Dépense"
                type={TYPES.EXPENSE}
                months={months}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                amount={depenseMonth}
              />
              <BoxStat
                title="Dépense totale"
                type={TYPES.EXPENSE}
                selectedYear={selectedYear}
                amount={depenseYear}
              />
            </div>
            <div className="flex flex-row gap-4 w-full text-right">
              <Container custom="!w-8 !justify-center items-center">
                <h1 className="text-center italic text-xs -rotate-90">
                  Économie
                </h1>
              </Container>
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
            <div className="flex flex-row gap-4 w-full text-right">
              <Container custom="!w-8 !justify-center items-center">
                <h1 className="text-center italic text-xs -rotate-90">
                  Investissement
                </h1>
              </Container>
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
                amount={amountInvestisMonth}
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
          <div className="w-1/3">
            <Container>
              <h2 className="text-left mb-4">Résumé</h2>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-justify font-thin">
                  {isCurrentDate
                    ? "Ce mois-ci"
                    : `En ${months[parseInt(selectedMonth) - 1]} ${selectedYear}`}
                  , vous avez perçu{" "}
                  {formatCurrency.format(Math.abs(recetteMonth))}, et dépensé{" "}
                  {formatCurrency.format(Math.abs(depenseMonth))},{" "}
                  {economieMonth < 0
                    ? "générant un déficit de"
                    : "ce qui vous a permis d’économiser"}{" "}
                  <span
                    className={
                      economieMonth < 0
                        ? "text-colorExpense"
                        : "text-colorRevenue"
                    }
                  >
                    {formatCurrency.format(Math.abs(economieMonth))}
                  </span>
                  {amountInvestisMonth !== 0 ? "." : ","}
                  {amountInvestisMonth !== 0 && (
                    <>
                      {" "}
                      {economieMonth < 0
                        ? "De plus, vous avez investi"
                        : "Vous avez aussi investi"}{" "}
                      {formatCurrency.format(Math.abs(amountInvestisMonth))},
                    </>
                  )}{" "}
                  {rest < 0 && economieMonth < 0
                    ? "portant votre dette à "
                    : rest > 0
                      ? "laissant une épargne nette de "
                      : "entraînant une dette de "}{" "}
                  <span
                    className={
                      rest < 0 ? "text-colorExpense" : "text-colorRevenue"
                    }
                  >
                    {formatCurrency.format(Math.abs(rest))}
                  </span>
                  .
                </p>
                <p className="text-sm text-justify font-thin">
                  {isCurrentYear ? "Cette année" : `En ${selectedYear}`}, vous
                  avez perçu {formatCurrency.format(Math.abs(recetteYear))}, et
                  dépensé {formatCurrency.format(Math.abs(depenseYear))},{" "}
                  {economieMonth < 0
                    ? "générant un déficit de "
                    : "ce qui vous a permis d’économiser "}
                  <span
                    className={
                      economieTotale < 0
                        ? "text-colorExpense"
                        : "text-colorRevenue"
                    }
                  >
                    {formatCurrency.format(Math.abs(economieTotale))}
                  </span>
                  {amountInvestisYear !== 0 ? "." : ","}
                  {amountInvestisYear !== 0 && (
                    <>
                      {" "}
                      {economieTotale < 0
                        ? "De plus, vous avez investi"
                        : "Vous avez aussi investi"}{" "}
                      {formatCurrency.format(Math.abs(amountInvestisYear))},
                    </>
                  )}{" "}
                  {restYear < 0 && economieTotale < 0
                    ? "portant votre dette à "
                    : restYear > 0
                      ? "laissant une épargne nette de "
                      : "entraînant une dette de "}{" "}
                  <span
                    className={
                      restYear < 0 ? "text-colorExpense" : "text-colorRevenue"
                    }
                  >
                    {formatCurrency.format(Math.abs(restYear))}
                  </span>
                  .
                </p>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}

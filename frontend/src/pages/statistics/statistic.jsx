import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { calculTotalByMonth, calculTotalByYear } from "../../utils/calcul";
import {
  aggregateTransactions,
  getTransactionsByType,
} from "../../utils/operations";
import { fetchTransactions } from "../../services/transaction.service";
import { fetchInvestments } from "../../services/investment.service";
import { currentDate, months } from "../../utils/other";
import { HttpStatusCode } from "axios";
import BoxStat from "../../components/boxs/boxStat";
import Header from "../../components/headers";
import Container from "../../components/containers/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadialChart } from "../../components/chartss/radialChart";
import { renderCustomLegend } from "../../components/legends";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import { toast } from "sonner";
import { TYPES } from "../../staticDatas/staticData";
import { formatCurrency } from "../../utils/fonctionnel";
import { useAuth } from "../../context/authContext";
import SkeletonDashboard from "../../components/skeletonBoard";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export default function Statistic() {
  const { user: dataUser } = useAuth();
  const { month: currentMonth, year: currentYear } = currentDate();
  const { isVisible } = useAmountVisibility();
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
        .filter(
          (t) => t.date.slice(0, 4) === `${selectedYear}` && t.type === "buy"
        )
        .reduce((s, t) => s + (t.amount || 0), 0);
      return acc + total;
    }, 0);
  }, [dataInvests, selectedYear]);

  const amountInvestisMonth = useMemo(() => {
    if (!dataInvests) return 0;
    return dataInvests.reduce((acc, d) => {
      const total = d.transaction
        .filter(
          (t) =>
            t.date.slice(0, 7) === `${selectedYear}-${selectedMonth}` &&
            t.type === "buy"
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

  const rest = economieMonth + amountInvestisMonth;

  const restYear = economieTotale + amountInvestisYear;

  const isCurrentDate = selectedDate === `${currentYear}${currentMonth}`;

  const isCurrentYear = selectedYear === currentYear;

  if (isLoading) return <SkeletonDashboard />;

  return (
    <section className="w-full">
      <Header title="Mes Statistiques" isFetching={isFetching} />
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col  md:flex-row gap-2">
          <Carousel className="md:max-w-xs overflow-hidden w-auto">
            <CarouselContent className="flex gap-2 snap-x">
              {years.map((year, i) => (
                <CarouselItem
                  key={i}
                  className={`${years.length > 1 && "basis-1/2"}`}
                >
                  <Button
                    variant={selectedYear === year ? "default" : "secondary"}
                    onClick={() => setSelectedYear(year)}
                    className="w-full active:scale-90 transition-all"
                  >
                    {year}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Separator
            orientation="vertical"
            className="h-7 my-auto bg-secondary hidden md:block"
          />
          <div className="flex flex-wrap w-full gap-2">
            {monthsList.map((m, i) => (
              <Button
                key={i}
                variant={
                  selectedMonth === String(m).padStart(2, "0")
                    ? "default"
                    : "secondary"
                }
                className="w-full max-w-fit animate-fade active:scale-90 transition-all"
                onClick={() => setSelectedMonth(String(m).padStart(2, "0"))}
              >
                {months[m - 1]}
              </Button>
            ))}
          </div>
        </div>
        <Container custom="flex flex-col gap-4 lg:gap-0 lg:flex-row">
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
              Revenus de {selectedYear}
            </p>

            <RadialChart
              chartData={transformedDataRevenueYear}
              chartConfig={chartConfigRevenue}
              legend={renderCustomLegend}
              inner={30}
              outer={45}
              height={110}
            />
          </div>
          <Separator
            orientation="vertical"
            className="h-32 my-auto bg-secondary mr-4 hidden lg:block"
          />
          <Separator
            orientation="horizontal"
            className="mx-auto bg-secondary lg:hidden block"
          />
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
              Dépenses {selectedYear}
            </p>
            <RadialChart
              chartData={transformedDataExpenseYear}
              chartConfig={chartConfigExpense}
              legend={renderCustomLegend}
              inner={30}
              outer={45}
              height={110}
            />
          </div>
          <Separator
            orientation="vertical"
            className="h-32 my-auto bg-secondary mr-4 hidden lg:block"
          />
          <Separator
            orientation="horizontal"
            className="mx-auto bg-secondary lg:hidden block"
          />
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
              Revenus de {convertDate(selectedDate)}
            </p>
            <RadialChart
              chartData={transformedDataRevenueMonth}
              chartConfig={chartConfigRevenue}
              legend={renderCustomLegend}
              inner={30}
              outer={45}
              height={110}
            />
          </div>
          <Separator
            orientation="vertical"
            className="h-32 my-auto bg-secondary mr-4 hidden lg:block"
          />
          <Separator
            orientation="horizontal"
            className="mx-auto bg-secondary lg:hidden block"
          />
          <div className="flex flex-col w-full">
            <p className="italic font-thin text-xs text-left">
              Dépenses de {convertDate(selectedDate)}
            </p>
            <RadialChart
              chartData={transformedDataExpenseMonth}
              chartConfig={chartConfigExpense}
              legend={renderCustomLegend}
              inner={30}
              outer={45}
              height={110}
            />
          </div>
        </Container>
        <div className="flex flex-col lg:flex-row gap-4 animate-fade">
          <div className="flex flex-col items-center gap-4 w-full max-w-4xl md:w-2/3">
            <div className="flex-col md:flex-row gap-2 md:gap-4 w-full text-center md:text-right hidden lg:flex">
              <Container custom="!w-8 self-center md:self-auto" />
              <Container custom="!p-2">
                <h1 className="italic text-xs text-center">Moyenne/Mois</h1>
              </Container>
              <Container custom="!p-2">
                <h1 className="italic text-xs text-center">Par mois</h1>
              </Container>
              <Container custom="!p-2">
                <h1 className="italic text-xs text-center">Par an</h1>
              </Container>
            </div>

            {[
              {
                label: "Revenu",
                data: [
                  {
                    title: "Revenu par Mois",
                    type: TYPES.INCOME,
                    amount: moyenneRecetteMois,
                  },
                  {
                    title: "Revenu",
                    type: TYPES.INCOME,
                    amount: recetteMonth,
                    months,
                    selectedMonth,
                    selectedYear,
                  },
                  {
                    title: "Revenu totale",
                    type: TYPES.INCOME,
                    amount: recetteYear,
                  },
                ],
              },
              {
                label: "Dépense",
                data: [
                  {
                    title: "Dépense par Mois",
                    type: TYPES.EXPENSE,
                    amount: moyenneDepenseMois,
                  },
                  {
                    title: "Dépense",
                    type: TYPES.EXPENSE,
                    amount: depenseMonth,
                    months,
                    selectedMonth,
                    selectedYear,
                  },
                  {
                    title: "Dépense totale",
                    type: TYPES.EXPENSE,
                    amount: depenseYear,
                  },
                ],
              },
              {
                label: "Économie",
                data: [
                  {
                    title: "Économie par Mois",
                    type: "State",
                    amount: moyenneEconomie,
                  },
                  {
                    title: economieMonth < 0 ? "Déficit" : "Économie",
                    type: "State",
                    amount: economieMonth,
                    months,
                    selectedMonth,
                    selectedYear,
                  },
                  {
                    title: "Économie totale",
                    type: "State",
                    amount: economieTotale,
                  },
                ],
              },
              {
                label: "Investissement",
                data: [
                  {
                    title: "Investissement par Mois",
                    type: "State",
                    amount: amountInvestisAverage,
                  },
                  {
                    title: "Investissement",
                    type: "State",
                    amount: amountInvestisMonth,
                    months,
                    selectedMonth,
                    selectedYear,
                  },
                  {
                    title: "Investissement totale",
                    type: "State",
                    amount: amountInvestisYear,
                  },
                ],
              },
            ].map(({ label, data }) => (
              <div
                key={label}
                className="flex flex-col md:flex-row gap-2 md:gap-4 w-full text-center md:text-right"
              >
                <Container custom="lg:!w-8 !justify-center items-center self-center md:self-auto">
                  <h1 className="italic text-xs -rotate-0 md:-rotate-90">
                    {label}
                  </h1>
                </Container>
                {data.map((item, i) => (
                  <BoxStat
                    key={i}
                    title={item.title}
                    type={item.type}
                    selectedYear={selectedYear}
                    amount={item.amount}
                    months={item.months}
                    selectedMonth={item.selectedMonth}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="lg:w-1/2">
            <Container>
              <h2 className="text-left mb-4">Résumé</h2>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-justify font-thin">
                  {isCurrentDate
                    ? "Ce mois-ci"
                    : `En ${months[parseInt(selectedMonth) - 1]} ${selectedYear}`}
                  , vous avez perçu{" "}
                  {isVisible
                    ? formatCurrency.format(Math.abs(recetteMonth))
                    : "••••"}
                  , et dépensé{" "}
                  {isVisible
                    ? formatCurrency.format(Math.abs(depenseMonth))
                    : "••••"}
                  ,{" "}
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
                    {isVisible
                      ? formatCurrency.format(Math.abs(economieMonth))
                      : "••••"}
                  </span>
                  {amountInvestisMonth !== 0 ? "." : ","}
                  {amountInvestisMonth !== 0 && (
                    <>
                      {" "}
                      {economieMonth < 0
                        ? "De plus, vous avez investi"
                        : "Vous avez aussi investi"}{" "}
                      {isVisible
                        ? formatCurrency.format(Math.abs(amountInvestisMonth))
                        : "••••"}
                      ,
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
                    {isVisible ? formatCurrency.format(Math.abs(rest)) : "••••"}
                  </span>
                  .
                </p>

                <p className="text-sm text-justify font-thin">
                  {isCurrentYear ? "Cette année" : `En ${selectedYear}`}, vous
                  avez perçu{" "}
                  {isVisible
                    ? formatCurrency.format(Math.abs(recetteYear))
                    : "••••"}
                  , et dépensé{" "}
                  {isVisible
                    ? formatCurrency.format(Math.abs(depenseYear))
                    : "••••"}
                  ,{" "}
                  {economieTotale < 0
                    ? "générant un déficit de "
                    : "ce qui vous a permis d’économiser "}
                  <span
                    className={
                      economieTotale < 0
                        ? "text-colorExpense"
                        : "text-colorRevenue"
                    }
                  >
                    {isVisible
                      ? formatCurrency.format(Math.abs(economieTotale))
                      : "••••"}
                  </span>
                  {amountInvestisYear !== 0 ? "." : ","}
                  {amountInvestisYear !== 0 && (
                    <>
                      {" "}
                      {economieTotale < 0
                        ? "De plus, vous avez investi"
                        : "Vous avez aussi investi"}{" "}
                      {isVisible
                        ? formatCurrency.format(Math.abs(amountInvestisYear))
                        : "••••"}
                      ,
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
                    {isVisible
                      ? formatCurrency.format(Math.abs(restYear))
                      : "••••"}
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

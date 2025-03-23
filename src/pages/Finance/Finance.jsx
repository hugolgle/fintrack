import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { HttpStatusCode } from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  calculTotalAmount,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../utils/calcul.js";
import {
  currentDate,
  getLastMonths,
  months,
  updateMonth,
} from "../../utils/other.js";
import { fetchTransactions } from "../../Service/Transaction.service.jsx";
import Header from "../../composant/Header.jsx";
import { ChartLine } from "../../composant/Charts/ChartLine.jsx";
import Loader from "../../composant/Loader/Loader.jsx";
import BoxInfos from "../../composant/Box/BoxInfos.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  aggregateTransactions,
  getLastOperations,
  getTransactionsByType,
} from "../../utils/operations.js";
import { renderCustomLegend } from "../../composant/Legend.jsx";
import { RadialChart } from "../../composant/Charts/RadialChart.jsx";
import LoaderDots from "../../composant/Loader/LoaderDots.jsx";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "../../composant/Routes.jsx";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import { CircleDollarSign } from "lucide-react";
import { WalletCards } from "lucide-react";
import Container from "../../composant/Container/Container.jsx";
import { TYPES } from "../../StaticData/StaticData.js";
import { FormTransac } from "./FormFinance.jsx";

export default function BoardTransactions() {
  const { month, year } = currentDate();
  const currentYearMonth = `${year}${month}`;
  const [selectNbMonth, setSelectNbMonth] = useState(12);
  const [graphMonth, setGraphMonth] = useState(currentYearMonth);
  const [monthChartRadial, setMonth] = useState(currentYearMonth);
  const navigate = useNavigate();

  const {
    isLoading,
    data: dataTransactions,
    isFetching,
    refetch,
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
  if (isLoading) return <Loader />;

  const lastMonthYear = updateMonth(currentYearMonth, -1);

  const dataRevenue = getTransactionsByType(dataTransactions, TYPES.INCOME);
  const dataExpense = getTransactionsByType(dataTransactions, TYPES.EXPENSE);

  const revenuePieChartMonth = dataRevenue?.filter((transaction) => {
    const transactionDate = transaction.date.split("T")[0];
    const transactionMonth = transactionDate.slice(0, 7);

    return (
      transactionMonth ===
      `${monthChartRadial.slice(0, 4)}-${monthChartRadial.slice(4)}`
    );
  });

  const expensePieChartMonth = dataExpense?.filter((transaction) => {
    const transactionDate = transaction.date.split("T")[0];
    const transactionMonth = transactionDate.slice(0, 7);

    return (
      transactionMonth ===
      `${monthChartRadial.slice(0, 4)}-${monthChartRadial.slice(4)}`
    );
  });

  const chartDataRevenue = aggregateTransactions(revenuePieChartMonth);
  const chartDataExpense = aggregateTransactions(expensePieChartMonth);

  const totalAmountRevenue = chartDataRevenue.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalAmountExpense = chartDataExpense.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const categoryColorsRevenue = categoryRecette.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {});
  const categoryColorsExpense = categoryDepense.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {});

  const transformedDataRevenue = chartDataRevenue.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountRevenue) * 100,
    fill: categoryColorsRevenue[item.nomCate],
  }));
  const transformedDataExpense = chartDataExpense.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmountExpense) * 100,
    fill: categoryColorsExpense[item.nomCate],
  }));

  const chartConfigRevenue = Object.keys(categoryColorsRevenue).reduce(
    (acc, category) => {
      acc[category.toLowerCase()] = {
        label: category,
        color: categoryColorsRevenue[category],
      };
      return acc;
    },
    {}
  );
  const chartConfigExpense = Object.keys(categoryColorsExpense).reduce(
    (acc, category) => {
      acc[category.toLowerCase()] = {
        label: category,
        color: categoryColorsExpense[category],
      };
      return acc;
    },
    {}
  );

  const defaultConfig = {
    amountRevenue: {
      label: TYPES.INCOME,
      color: "hsl(var(--graph-revenue))",
      visible: true,
    },
    amountExpense: {
      label: "Dépense",
      color: "hsl(var(--graph-expense))",
      visible: true,
    },
    text: { color: "hsl(var(--foreground))" },
  };

  const monthsGraph = getLastMonths(graphMonth, selectNbMonth);
  const amountMonthExpense = [];
  const amountMonthRevenue = [];
  monthsGraph.forEach(({ code }) => {
    amountMonthExpense.push(
      Math.abs(calculTotalByMonth(dataTransactions, TYPES.EXPENSE, code))
    );
    amountMonthRevenue.push(
      Math.abs(calculTotalByMonth(dataTransactions, TYPES.INCOME, code))
    );
  });
  const dataGraph = monthsGraph.map((m, i) => ({
    month: m.month,
    year: m.year,
    amountExpense: amountMonthExpense[i],
    amountRevenue: amountMonthRevenue[i],
  }));
  const maxValue = Math.max(
    ...dataGraph.map((item) => Math.max(item.amountRevenue, item.amountExpense))
  );

  const dataOperations = Array.isArray(dataTransactions)
    ? dataTransactions
    : [];
  const lastOperations = getLastOperations(dataOperations, null, 7, false);

  const convertDate = (date) => {
    const annee = Math.floor(date / 100);
    const mois = date % 100;
    return `${months[mois - 1]} ${annee}`;
  };

  const clickNextMonthGraph = () => setGraphMonth(updateMonth(graphMonth, 1));
  const clickLastMonthGraph = () => setGraphMonth(updateMonth(graphMonth, -1));
  const clickNextMonth = () => setMonth(updateMonth(monthChartRadial, 1));
  const clickLastMonth = () => setMonth(updateMonth(monthChartRadial, -1));

  const firstMonthGraph = monthsGraph[0];
  const lastMonthGraph = monthsGraph[monthsGraph.length - 1];
  const theMonthGraph = `${firstMonthGraph.month} ${firstMonthGraph.year} - ${lastMonthGraph.month} ${lastMonthGraph.year}`;

  const chevronIsVisible = monthChartRadial < currentYearMonth;
  const chevronGraphIsVisible = lastMonthGraph.code < currentYearMonth;

  const totalRevenue = calculTotalAmount(revenuePieChartMonth);
  const totalExpense = calculTotalAmount(revenuePieChartMonth);

  const currentDateBis = new Date();
  const lastMonthDate = new Date(
    currentDateBis.setMonth(currentDateBis.getMonth() - 1)
  );

  const startOfLastMonth = new Date(
    lastMonthDate.getFullYear(),
    lastMonthDate.getMonth(),
    1
  );
  const endOfLastMonth = new Date(
    lastMonthDate.getFullYear(),
    lastMonthDate.getMonth() + 1,
    0
  );
  const mySubscription = dataTransactions
    ?.filter(
      (data) =>
        data.category === "Abonnement" &&
        new Date(data.date) >= startOfLastMonth &&
        new Date(data.date) <= endOfLastMonth
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const totalMySubscription = mySubscription.reduce(
    (total, item) => total + (item.amount || 0),
    0
  );

  const categoriesDf = categoryDepense.map((category) => {
    if (category.category === "Fixe") {
      return category.name;
    }
  });

  const categoriesLoisir = categoryDepense.map((category) => {
    if (category.category === "Loisir") {
      return category.name;
    }
  });

  const dataDf = calculTotalByMonth(
    dataTransactions,
    TYPES.EXPENSE,
    monthChartRadial,
    categoriesDf
  );
  const dataLoisir = calculTotalByMonth(
    dataTransactions,
    TYPES.EXPENSE,
    monthChartRadial,
    categoriesLoisir
  );

  const dFix = Math.abs(dataDf);
  const dLoisir = Math.abs(dataLoisir);
  const totalPart = calculTotalByMonth(
    dataTransactions,
    TYPES.INCOME,
    monthChartRadial
  );

  let epargne = totalPart - (dFix + dLoisir);

  if (epargne < 0) {
    epargne = 0;
  }

  const chartDataPart = [
    {
      name: "Dépenses fixes",
      amount: dFix,
      pourcentage: (dFix / totalPart) * 100 || 0,
      fill: "var(--color-depensesFixes)",
      objectif: 50,
    },
    {
      name: "Loisir",
      amount: dLoisir,
      pourcentage: (dLoisir / totalPart) * 100 || 0,
      fill: "var(--color-loisir)",
      objectif: 30,
    },
    {
      name: "Épargne",
      amount: epargne,
      pourcentage: (epargne / totalPart) * 100 || 0,
      fill: "var(--color-epargne)",
      objectif: 20,
    },
  ];

  const chartConfigPart = {
    depensesFixes: {
      label: "Dépenses fixes",
      color: "hsl(var(--graph-expensesFix))",
    },
    loisir: {
      label: "Loisir",
      color: "hsl(var(--graph-loisir))",
    },
    epargne: {
      label: "Épargne",
      color: "hsl(var(--graph-epargn))",
    },
  };

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Finance"
          modalAdd={<FormTransac refetch={refetch} />}
          isFetching={isFetching}
        />
        <div className="flex flex-col gap-4 w-full animate-fade">
          <div className="flex gap-4 w-full">
            <BoxInfos
              onClick={() =>
                navigate(
                  ROUTES.EXPENSE_BY_MONTH.replace(":year", year).replace(
                    ":month",
                    month
                  )
                )
              }
              title="Dépense ce mois"
              value={calculTotalByMonth(
                dataTransactions,
                TYPES.EXPENSE,
                currentYearMonth
              )}
              valueLast={
                calculTotalByMonth(
                  dataTransactions,
                  TYPES.EXPENSE,
                  lastMonthYear
                ) || null
              }
              icon={<WalletCards size={15} color="grey" />}
              isAmount
              type="depense"
            />
            <BoxInfos
              onClick={() =>
                navigate(
                  ROUTES.REVENUE_BY_MONTH.replace(":year", year).replace(
                    ":month",
                    month
                  )
                )
              }
              title="Revenu ce mois"
              value={calculTotalByMonth(
                dataTransactions,
                TYPES.INCOME,
                currentYearMonth
              )}
              valueLast={
                calculTotalByMonth(
                  dataTransactions,
                  TYPES.INCOME,
                  lastMonthYear
                ) || null
              }
              icon={<CircleDollarSign size={15} color="grey" />}
              isAmount
              type="revenue"
            />
            <BoxInfos
              onClick={() =>
                navigate(ROUTES.EXPENSE_BY_YEAR.replace(":year", year))
              }
              title={`Dépense en ${year}`}
              value={
                calculTotalByYear(dataTransactions, TYPES.EXPENSE, year) || null
              }
              valueLast={
                calculTotalByYear(dataTransactions, TYPES.EXPENSE, year - 1) ||
                null
              }
              yearLast={year - 1}
              icon={<WalletCards size={15} color="grey" />}
              isAmount
              type="depense"
            />
            <BoxInfos
              onClick={() =>
                navigate(ROUTES.REVENUE_BY_YEAR.replace(":year", year))
              }
              title={`Revenu en ${year}`}
              value={
                calculTotalByYear(dataTransactions, TYPES.INCOME, year) || null
              }
              valueLast={
                calculTotalByYear(dataTransactions, TYPES.INCOME, year - 1) ||
                null
              }
              yearLast={year - 1}
              icon={<CircleDollarSign size={15} color="grey" />}
              isAmount
              type="revenue"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-4/5">
              <div className="flex flex-col gap-4">
                <Container>
                  <h2 className="text-left">Graphique</h2>
                  {!isFetching ? (
                    <ChartLine
                      data={dataGraph}
                      defaultConfig={defaultConfig}
                      maxValue={maxValue}
                    />
                  ) : (
                    <LoaderDots />
                  )}
                  <div className="flex flex-row w-4/5 max-w-[500px] mx-auto px-20 items-center justify-between">
                    <div className="w-1/12">
                      <ChevronLeft
                        size={25}
                        className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                        onClick={clickLastMonthGraph}
                      />
                    </div>
                    <p className="font-thin text-sm w-10/12 italic">
                      {theMonthGraph}
                    </p>
                    <div className="w-1/12">
                      {chevronGraphIsVisible && (
                        <ChevronRight
                          size={25}
                          className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                          onClick={clickNextMonthGraph}
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 m-2">
                    <Tabs
                      name="selectNbMonth"
                      value={selectNbMonth}
                      onValueChange={(value) => setSelectNbMonth(Number(value))}
                      className="w-full"
                    >
                      <TabsList>
                        <TabsTrigger value={6}>6 mois</TabsTrigger>
                        <TabsTrigger value={12}>1 an</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </Container>
                <Container>
                  <h2 className="text-left">Répartitions</h2>
                  <div className="flex">
                    <div className="flex flex-col w-full p-4">
                      <p className="italic font-thin text-left text-xs">
                        Dépense
                      </p>
                      {!isFetching ? (
                        totalExpense !== "0.00" ? (
                          <RadialChart
                            chartData={transformedDataExpense}
                            chartConfig={chartConfigExpense}
                            total={totalExpense}
                            legend={renderCustomLegend}
                            inner={40}
                            outer={55}
                            height={120}
                          />
                        ) : (
                          <p className="h-[225px]">Aucune donnée</p>
                        )
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
                        Revenue
                      </p>
                      {!isFetching ? (
                        totalRevenue !== "0.00" ? (
                          <RadialChart
                            chartData={transformedDataRevenue}
                            chartConfig={chartConfigRevenue}
                            total={totalRevenue}
                            legend={renderCustomLegend}
                            inner={40}
                            outer={55}
                            height={120}
                          />
                        ) : (
                          <p className="h-[225px]">Aucune donnée</p>
                        )
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
                        50/30/20
                      </p>
                      {!isFetching ? (
                        totalPart !== "0.00" ? (
                          <RadialChart
                            chartData={chartDataPart}
                            chartConfig={chartConfigPart}
                            total={totalPart}
                            legend={renderCustomLegend}
                            inner={40}
                            outer={55}
                            height={120}
                          />
                        ) : (
                          <p className="h-[225px]">Aucune donnée</p>
                        )
                      ) : (
                        <LoaderDots />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between max-w-[200px] w-3/4 mx-auto">
                    <div className="w-1/12">
                      <ChevronLeft
                        size={25}
                        onClick={clickLastMonth}
                        className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                      />
                    </div>
                    <p className="font-thin text-sm w-10/12 italic">
                      {convertDate(monthChartRadial)}
                    </p>
                    <div className="w-1/12">
                      {chevronIsVisible && (
                        <ChevronRight
                          size={25}
                          onClick={clickNextMonth}
                          className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                        />
                      )}
                    </div>
                  </div>
                </Container>
              </div>
            </div>
            <div className="w-1/5 flex flex-col gap-4">
              <Container>
                <h2 className="text-left mb-4">Dernières transactions</h2>
                <table className="h-full">
                  <tbody className="w-full h-full gap-2 flex flex-col">
                    {lastOperations.map((operation) => (
                      <tr
                        key={operation._id}
                        className="justify-between h-full flex flex-row items-center text-xs"
                      >
                        <td className="flex flex-row space-x-4 w-full">
                          <span>{format(operation.date, "dd/MM")}</span>
                          <span className="truncate">{operation.title}</span>
                        </td>
                        <td
                          className={`w-fit px-2 py-[1px] text-[10px] italic text-nowrap rounded-md ${operation.type === TYPES.EXPENSE ? "bg-colorExpense text-red-900 dark:bg-colorExpense dark:text-red-900" : "bg-colorRevenue text-green-900 dark:bg-colorRevenue dark:text-green-900"}`}
                        >
                          <span>{formatCurrency.format(operation.amount)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Container>
              <Container>
                <h2 className="text-left mb-4">Mes abonnements</h2>
                <table className="h-full">
                  <tbody className="w-full h-full gap-2 flex flex-col">
                    {mySubscription.map((operation) => (
                      <tr
                        key={operation._id}
                        className="justify-between h-full flex flex-row items-center text-xs"
                      >
                        <td className="flex flex-row space-x-4 w-full">
                          <span>{format(operation.date, "dd/MM")}</span>
                          <span className="truncate">{operation.title}</span>
                        </td>
                        <td className="text-[10px] italic text-nowrap">
                          <span>{formatCurrency.format(operation.amount)}</span>
                        </td>
                      </tr>
                    ))}
                    <p className="text-[12px] text-right italic font-black">
                      = {formatCurrency.format(totalMySubscription)}
                    </p>
                  </tbody>
                </table>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

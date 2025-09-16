import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { HttpStatusCode } from "axios";
import { ChevronLeft, ChevronRight, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculTotalAmount,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../utils/calcul.js";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  currentDate,
  getLastMonths,
  months,
  updateMonth,
} from "../../utils/other.js";
import { fetchTransactions } from "../../services/transaction.service.jsx";
import Header from "../../components/headers.jsx";
import { ChartLine } from "../../components/chartss/chartLine.jsx";
import Loader from "../../components/loaders/loader.jsx";
import BoxInfos from "../../components/boxs/boxInfos.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  aggregateTransactions,
  getLastOperations,
  getTransactionsByType,
} from "../../utils/operations.js";
import { renderCustomLegend } from "../../components/legends.jsx";
import { RadialChart } from "../../components/chartss/radialChart.jsx";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "../../components/route.jsx";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import { CircleDollarSign } from "lucide-react";
import { WalletCards } from "lucide-react";
import Container from "../../components/containers/container.jsx";
import { TYPES } from "../../staticDatas/staticData.js";
import { FormTransac } from "./formFinance.jsx";
import SkeletonDashboard from "../../components/skeletonBoard.jsx";
import { useAmountVisibility } from "../../context/AmountVisibilityContext.jsx";
import { fetchGroupTransactions } from "../../services/groupTransaction.service.jsx";

export default function BoardTransactions() {
  const { isVisible } = useAmountVisibility();
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

  const { data: dataGroupTransactions } = useQuery({
    queryKey: ["fetchGroupTransactions"],
    queryFn: async () => {
      const response = await fetchGroupTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  if (isLoading) return <SkeletonDashboard />;

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
  const lastMonth = new Date(
    currentDateBis.getFullYear(),
    currentDateBis.getMonth() - 1,
    1
  );

  const startOfLastMonth = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth(),
    1
  );

  const endOfLastMonth = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth() + 1,
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

  const revenueByMonth = calculTotalByMonth(
    dataTransactions,
    TYPES.INCOME,
    currentYearMonth
  );

  const expenseByMonth = calculTotalByMonth(
    dataTransactions,
    TYPES.EXPENSE,
    currentYearMonth
  );

  const revenueLastMonth = calculTotalByMonth(
    dataTransactions,
    TYPES.INCOME,
    lastMonthYear
  );

  const expenseLastMonth = calculTotalByMonth(
    dataTransactions,
    TYPES.EXPENSE,
    lastMonthYear
  );

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Mes Finances"
          subtitle="Gérez vos finances et suivez vos transactions"
          isFetching={isFetching}
          navigation={
            <Dialog modal>
              <DialogTrigger>
                {dataTransactions?.length < 0 && (
                  <Button>
                    <Plus />
                    <p className="hidden md:block">Nouvelle transaction</p>
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent>
                <FormTransac refetch={refetch} />
              </DialogContent>
            </Dialog>
          }
        />

        {dataTransactions?.length > 0 ? (
          <div className="flex flex-col gap-4 w-full animate-fade">
            <div className="flex flex-col lg:flex-row gap-4 w-full">
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
                value={revenueByMonth || null}
                valueLast={revenueLastMonth || null}
                icon={<CircleDollarSign size={15} color="grey" />}
                isAmount
                type="revenue"
              />
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
                value={expenseByMonth || null}
                valueLast={expenseLastMonth || null}
                icon={<WalletCards size={15} color="grey" />}
                isAmount
                type="depense"
              />
              <BoxInfos
                title="Solde"
                value={(revenueByMonth || null) - Math.abs(expenseByMonth || null)}
                valueLast={
                  (revenueLastMonth || null) - Math.abs(expenseLastMonth || null)
                }
                icon={<Wallet size={15} color="grey" />}
                isAmount
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col gap-4 lg:w-4/5">
                {/* Graphique */}
                <Container>
                  <h2 className="text-left">Graphique</h2>
                  <ChartLine
                    data={dataGraph}
                    defaultConfig={defaultConfig}
                    maxValue={maxValue}
                  />
                  <div className="flex flex-row w-4/5 max-w-[500px] mx-auto md:px-20 items-center justify-between">
                    <ChevronLeft
                      size={25}
                      className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                      onClick={clickLastMonthGraph}
                    />
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

                {/* Répartitions */}
                <Container>
                  <h2 className="text-left">Répartitions</h2>
                  <div className="flex flex-col md:flex-row">
                    {/* Dépense */}
                    <div className="flex flex-col w-full p-4">
                      <p className="italic font-thin text-left text-xs">
                        Dépense
                      </p>
                      {totalExpense !== "0.00" ? (
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
                      )}
                    </div>

                    <Separator
                      orientation="vertical"
                      className="h-32 my-auto bg-secondary mr-4 hidden lg:block"
                    />
                    <Separator
                      orientation="horizontal"
                      className="mx-auto bg-secondary lg:hidden block"
                    />

                    {/* Revenue */}
                    <div className="flex flex-col w-full p-4">
                      <p className="italic font-thin text-left text-xs">
                        Revenue
                      </p>
                      {totalRevenue !== "0.00" ? (
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
                      )}
                    </div>

                    <Separator
                      orientation="vertical"
                      className="h-32 my-auto bg-secondary mr-4 hidden lg:block"
                    />
                    <Separator
                      orientation="horizontal"
                      className="mx-auto bg-secondary lg:hidden block"
                    />

                    {/* 50/30/20 */}
                    <div className="flex flex-col w-full p-4">
                      <p className="italic font-thin text-left text-xs">
                        50/30/20
                      </p>
                      {totalPart !== "0.00" ? (
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
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row justify-between max-w-[200px] w-3/4 mx-auto">
                    <ChevronLeft
                      size={25}
                      onClick={clickLastMonth}
                      className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                    />
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

              {/* Sidebar */}
              <div className="lg:w-1/5 flex flex-col gap-4">
                {/* Dernières transactions */}
                <Container>
                  <h2 className="text-left mb-4">Dernières transactions</h2>
                  <div className="h-full flex flex-col gap-2">
                    {lastOperations.map((operation) => (
                      <div
                        key={operation._id}
                        className="justify-between flex flex-row items-center text-xs h-full"
                      >
                        <p className="flex flex-row space-x-4 w-4/5">
                          <span>{format(operation.date, "dd/MM")}</span>
                          <span className="truncate">{operation.title}</span>
                        </p>
                        <p
                          className={`w-fit px-2 py-[1px] text-[10px] italic rounded-md ${
                            operation.type === TYPES.EXPENSE
                              ? "bg-colorExpense text-red-900 dark:bg-colorExpense dark:text-red-900"
                              : "bg-colorRevenue text-green-900 dark:bg-colorRevenue dark:text-green-900"
                          }`}
                        >
                          <span>
                            {isVisible
                              ? formatCurrency.format(operation.amount)
                              : "••••"}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </Container>

                {/* Mes abonnements */}
                <Container>
                  <h2 className="text-left mb-4">Mes abonnements</h2>
                  <div className="h-full flex flex-col gap-2">
                    {mySubscription.map((operation) => (
                      <div
                        key={operation._id}
                        className="justify-between flex flex-row items-center text-xs h-full"
                      >
                        <p className="flex flex-row space-x-4 w-4/5">
                          <span>{format(operation.date, "dd/MM")}</span>
                          <span className="truncate">{operation.title}</span>
                        </p>
                        <p className="text-[10px] italic text-nowrap">
                          <span>
                            {isVisible
                              ? formatCurrency.format(operation.amount)
                              : "••••"}
                          </span>
                        </p>
                      </div>
                    ))}
                    <p className="text-[12px] text-right italic font-black">
                      ={" "}
                      {isVisible
                        ? formatCurrency.format(totalMySubscription)
                        : "••••"}
                    </p>
                  </div>
                </Container>

                {/* Mes groupes */}
                <Container>
                  <div className="flex justify-between w-full mb-4">
                    <h2 className="text-nowrap">Mes groupes</h2>
                    <p
                      className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                      onClick={() => navigate(ROUTES.GROUP_TRANSACTION)}
                    >
                      Voir tout
                      <ChevronRight
                        size={12}
                        className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                      />
                    </p>
                  </div>
                  <div className="w-full h-full flex flex-col gap-2">
                    {dataGroupTransactions?.map((group, index) => (
                      <div
                        key={index}
                        className="justify-between flex flex-row items-center text-xs h-full"
                      >
                        <p className="flex flex-row space-x-4 w-4/5">
                          <span className="truncate">{group.name}</span>
                        </p>
                        <p className="text-[10px] italic text-nowrap">
                          <span>
                            {isVisible
                              ? formatCurrency.format(
                                  (group.transactions || []).reduce(
                                    (sum, t) => sum + Number(t.amount || 0),
                                    0
                                  )
                                )
                              : "••••"}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Aucun transaction enregistré</h2>
            <p className="text-muted-foreground">
              Commencez par ajouter une nouvelle transaction pour suivre vos
              paiements et gérer vos finances.
            </p>
            <Dialog modal>
              <DialogTrigger>
                <Button>
                  <Plus />
                  <p className="hidden md:block">Nouvelle transaction</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FormTransac refetch={refetch} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </section>
  );
}

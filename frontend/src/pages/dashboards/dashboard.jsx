import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  getLastOperations,
  getTagsOfTransactions,
} from "../../utils/operations.js";
import { calculTotalAmount, calculTotalByMonth } from "../../utils/calcul.js";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { currentDate, getLastMonths, months } from "../../utils/other.js";
import typeCreditList from "../../../public/typeCredit.json";
import { fetchTransactions } from "../../services/transaction.service.jsx";
import { fetchInvestments } from "../../services/investment.service.jsx";
import { fetchAccounts } from "../../services/epargn.service.jsx";
import { fetchAssets } from "../../services/heritage.service.jsx";
import Header from "../../components/headers.jsx";
import Loader from "../../components/loaders/loader.jsx";
import LoaderDots from "../../components/loaders/loaderDots.jsx";
import BoxInfos from "../../components/boxs/boxInfos.jsx";
import { ChartLine } from "../../components/chartss/chartLine.jsx";
import { RadialChart } from "../../components/chartss/radialChart.jsx";
import { renderCustomLegend } from "../../components/legends.jsx";
import Container from "../../components/containers/container.jsx";
import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  WalletCards,
  Landmark,
  HandCoins,
  Swords,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { ROUTES } from "../../components/route.jsx";
import { categoryDepense } from "../../../public/categories.json";
import * as Icons from "lucide-react";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { TYPES } from "../../staticDatas/staticData.js";
import { FormTransac } from "../finances/formFinance.jsx";
import { fetchCredits } from "../../services/credit.service.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { month: currentMonth, year: currentYear } = currentDate();
  const currentMonthYear = `${currentYear}${currentMonth}`;
  const {
    isLoading: loadingTransacs,
    data: dataTransacs,
    isFetching: isFetchingTransacs,
    refetch,
  } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const res = await fetchTransactions();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });
  const { isLoading: loadingAccounts, data: dataAccounts } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const res = await fetchAccounts();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });

  const { data: dataCredit } = useQuery({
    queryKey: ["fetchCredits"],
    queryFn: async () => {
      const res = await fetchCredits();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });

  const {
    isLoading: loadingInvests,
    data: dataInvests,
    isFetching: isFetchingInvests,
  } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const res = await fetchInvestments();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });
  const { data: dataAssets } = useQuery({
    queryKey: ["fetchAssets"],
    queryFn: async () => {
      const res = await fetchAssets();
      if (res?.status !== HttpStatusCode.Ok)
        toast.warn(res?.response?.data?.message || "Erreur");
      return res.data;
    },
    refetchOnMount: true,
  });

  const dataTransacsInvest = useMemo(
    () =>
      dataInvests?.flatMap((inv) =>
        inv.transaction.map((trans) => ({
          _id: trans._id,
          title: inv.name,
          amount: trans.amount,
          date: trans.date,
        }))
      ) || [],
    [dataInvests]
  );
  const amountRevenuesMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.INCOME, currentMonthYear),
    [dataTransacs, currentMonthYear]
  );
  const amountExpensesMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.EXPENSE, currentMonthYear),
    [dataTransacs, currentMonthYear]
  );
  const investCurrentMonth = useMemo(
    () => calculTotalAmount(dataTransacsInvest),
    [dataTransacsInvest]
  );
  const { previousMonth, previousYear } = useMemo(() => {
    let m = currentMonth - 1,
      y = currentYear;
    if (m === 0) {
      m = 12;
      y--;
    }
    return { previousMonth: String(m).padStart(2, "0"), previousYear: y };
  }, [currentMonth, currentYear]);
  const previousDate = `${previousYear}${previousMonth}`;
  const amountRevenuesLastMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.INCOME, previousDate),
    [dataTransacs, previousDate]
  );
  const amountExpensesLastMonth = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.EXPENSE, previousDate),
    [dataTransacs, previousDate]
  );
  const lastTransactions = useMemo(
    () => getLastOperations(dataTransacs, null, 4, false),
    [dataTransacs]
  );

  const lastInvestissements = useMemo(
    () => getLastOperations(dataTransacsInvest, null, 4, false),
    [dataTransacsInvest]
  );

  const [month, setMonth] = useState(currentMonthYear);
  const [graphMonth, setGraphMonth] = useState(currentMonthYear);
  const [selectNbMonth, setSelectNbMonth] = useState(12);
  const updateMonth = (dateStr, incr) => {
    let y = parseInt(dateStr.slice(0, 4), 10);
    let m = parseInt(dateStr.slice(4), 10) + incr;
    if (m === 0) {
      m = 12;
      y--;
    }
    if (m === 13) {
      m = 1;
      y++;
    }
    return `${y}${String(m).padStart(2, "0")}`;
  };
  const clickLastMonth = () => setMonth(updateMonth(month, -1));
  const clickNextMonth = () => setMonth(updateMonth(month, 1));
  const clickLastMonthGraph = () => setGraphMonth(updateMonth(graphMonth, -1));
  const clickNextMonthGraph = () => setGraphMonth(updateMonth(graphMonth, 1));

  const categoriesDf = useMemo(
    () =>
      categoryDepense.filter((c) => c.category === "Fixe").map((c) => c.name),
    []
  );
  const categoriesLoisir = useMemo(
    () =>
      categoryDepense.filter((c) => c.category === "Loisir").map((c) => c.name),
    []
  );
  const dataDf = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.EXPENSE, month, categoriesDf),
    [dataTransacs, month, categoriesDf]
  );
  const dataLoisir = useMemo(
    () =>
      calculTotalByMonth(dataTransacs, TYPES.EXPENSE, month, categoriesLoisir),
    [dataTransacs, month, categoriesLoisir]
  );
  const total = useMemo(
    () => calculTotalByMonth(dataTransacs, TYPES.INCOME, month),
    [dataTransacs, month]
  );
  const montantInvest = useMemo(
    () =>
      dataTransacsInvest
        .filter((inv) => {
          const d = new Date(inv.date);
          return (
            d.getFullYear() === parseInt(month.slice(0, 4), 10) &&
            d.getMonth() + 1 === parseInt(month.slice(4), 10)
          );
        })
        .reduce((sum, inv) => sum + inv.amount, 0),
    [dataTransacsInvest, month]
  );

  const monthsGraph = useMemo(
    () => getLastMonths(graphMonth, selectNbMonth),
    [graphMonth, selectNbMonth]
  );
  const dataGraph = useMemo(
    () =>
      monthsGraph.map(({ code, month: m, year }) => {
        const amountExpense = Math.abs(
          calculTotalByMonth(dataTransacs, TYPES.EXPENSE, code)
        );
        const amountRevenue = Math.abs(
          calculTotalByMonth(dataTransacs, TYPES.INCOME, code)
        );
        const montantInvests = Math.abs(
          dataTransacsInvest
            .filter((inv) => {
              const d = new Date(inv.date);
              return (
                d.getFullYear() === parseInt(code.slice(0, 4), 10) &&
                d.getMonth() + 1 === parseInt(code.slice(4), 10)
              );
            })
            .reduce((sum, inv) => sum + inv.amount, 0)
        );
        return {
          month: m,
          year,
          amountExpense,
          amountRevenue,
          montantInvest: montantInvests,
        };
      }),
    [monthsGraph, dataTransacs, dataTransacsInvest]
  );
  const maxValue = useMemo(
    () =>
      Math.max(
        ...dataGraph.map((item) =>
          Math.max(item.amountExpense, item.amountRevenue, item.montantInvest)
        )
      ),
    [dataGraph]
  );

  const dFix = Math.abs(dataDf);
  const dLoisir = Math.abs(dataLoisir);
  const mInvest = montantInvest;
  const epargne = useMemo(
    () => Math.max(total - (dFix + dLoisir + mInvest), 0),
    [total, dFix, dLoisir, mInvest]
  );
  const chartDataRadial = useMemo(() => {
    const raw = [
      {
        name: "Dépenses fixes",
        amount: dFix,
        fill: "var(--color-depensesFixes)",
      },
      { name: "Loisir", amount: dLoisir, fill: "var(--color-loisir)" },
      { name: "Investissements", amount: mInvest, fill: "var(--color-invest)" },
      { name: "Épargne", amount: epargne, fill: "var(--color-epargne)" },
    ];

    return raw
      .map((item) => ({
        ...item,
        pourcentage: total > 0 ? (item.amount / total) * 100 : 0,
      }))
      .filter((item) => item.pourcentage > 0); // <-- on enlève les slices à 0
  }, [dFix, dLoisir, mInvest, epargne, total]);

  const chartConfigRadial = {
    depensesFixes: {
      label: "Dépenses fixes",
      color: "hsl(var(--graph-expensesFix))",
    },
    loisir: { label: "Loisir", color: "hsl(var(--graph-loisir))" },
    invest: { label: "Investissements", color: "hsl(var(--graph-invest))" },
    epargne: { label: "Épargne", color: "hsl(var(--graph-epargn))" },
  };
  const convertDate = (date) => {
    const y = Math.floor(date / 100);
    const m = date % 100;
    return `${months[m - 1]} ${y}`;
  };

  const amountEpargn = useMemo(
    () => (dataAccounts || []).reduce((sum, acc) => sum + acc.balance, 0),
    [dataAccounts]
  );
  const amountAssets = useMemo(
    () => (dataAssets || []).reduce((sum, a) => sum + a.estimatePrice, 0),
    [dataAssets]
  );
  const amountInvestAll = useMemo(
    () =>
      Array.isArray(dataInvests)
        ? dataInvests.reduce((sum, inv) => sum + (inv.amountBuy || 0), 0)
        : 0,
    [dataInvests]
  );
  const amountHeritage = amountInvestAll + amountEpargn + amountAssets;

  const dataHeritage = useMemo(
    () => [
      { name: "Épargne", amount: amountEpargn },
      { name: "Investissement", amount: amountInvestAll },
      { name: "Bien", amount: amountAssets },
    ],
    [amountEpargn, amountInvestAll, amountAssets]
  );
  const transformedDataAccount = useMemo(
    () =>
      dataHeritage.map((item, i) => ({
        name: item.name,
        amount: item.amount,
        pourcentage: (item.amount / amountHeritage) * 100,
        fill: `hsl(var(--chart-${i + 2}))`,
      })),
    [dataHeritage, amountHeritage]
  );
  const chartConfigAccount = useMemo(
    () =>
      dataHeritage.reduce((config, { name }, i) => {
        config[name] = { label: name, color: `hsl(var(--chart-${i + 1}))` };
        return config;
      }, {}),
    [dataHeritage]
  );
  const firstMonthGraph = monthsGraph[0];
  const lastMonthGraph = monthsGraph[monthsGraph.length - 1];
  const theMonthGraph = `${firstMonthGraph.month} ${firstMonthGraph.year} - ${lastMonthGraph.month} ${lastMonthGraph.year}`;
  const chevronIsVisible = month < currentMonthYear;
  const chevronGraphIsVisible = lastMonthGraph.code < currentMonthYear;

  if (loadingTransacs || loadingAccounts || loadingInvests) return <Loader />;

  return (
    <section className="w-full">
      <Header
        title="Tableau de bord"
        isFetching={false}
        modalAdd={<FormTransac refetch={refetch} />}
      />
      <div className="flex flex-col gap-4 animate-fade">
        <div className="flex gap-4 w-full">
          <BoxInfos
            onClick={() =>
              navigate(
                ROUTES.REVENUE_BY_MONTH.replace(":year", currentYear).replace(
                  ":month",
                  currentMonth
                )
              )
            }
            type="revenue"
            title="Revenu"
            icon={<CircleDollarSign size={15} color="grey" />}
            value={amountRevenuesMonth}
            valueLast={amountRevenuesLastMonth || null}
            isAmount
          />
          <BoxInfos
            onClick={() =>
              navigate(
                ROUTES.EXPENSE_BY_MONTH.replace(":year", currentYear).replace(
                  ":month",
                  currentMonth
                )
              )
            }
            type="depense"
            title="Dépense"
            icon={<WalletCards size={15} color="grey" />}
            value={amountExpensesMonth}
            valueLast={amountExpensesLastMonth || null}
            isAmount
          />
          <BoxInfos
            onClick={() => navigate(ROUTES.INVESTMENT)}
            type="investment"
            title="Investissement"
            icon={<HandCoins size={15} color="grey" />}
            value={investCurrentMonth}
            isAmount
          />
          <BoxInfos
            onClick={() => navigate(ROUTES.EPARGN)}
            type="epargn"
            title="Épargne"
            icon={<Landmark size={15} color="grey" />}
            value={amountEpargn}
            isAmount
          />
          <BoxInfos
            onClick={() => navigate(ROUTES.HERITAGE)}
            title="Patrimoine"
            icon={<Swords size={15} color="grey" />}
            value={amountHeritage}
            isAmount
          />
        </div>
        <div className="flex flex-row gap-4 h-full">
          <div className="flex flex-col w-4/5 gap-4">
            <Container>
              <h2 className="text-left">Graphique</h2>
              {!isFetchingTransacs && !isFetchingInvests ? (
                <ChartLine
                  data={dataGraph}
                  defaultConfig={{
                    amountRevenue: {
                      label: "Revenu",
                      color: "hsl(var(--graph-revenue))",
                      visible: true,
                    },
                    amountExpense: {
                      label: "Dépense",
                      color: "hsl(var(--graph-expense))",
                      visible: true,
                    },
                    montantInvest: {
                      label: "Investissements",
                      color: "hsl(var(--graph-invest))",
                      visible: true,
                    },
                    text: { color: "hsl(var(--foreground))" },
                  }}
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
                <p className="font-thin text-sm italic">{theMonthGraph}</p>
                <div className="w-1/12">
                  {chevronGraphIsVisible && (
                    <ChevronRight
                      size={25}
                      className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                      onClick={clickNextMonthGraph}
                    />
                  )}
                </div>

                <div className="absolute top-0 right-0 m-2">
                  <Tabs
                    name="selectNbMonth"
                    value={selectNbMonth}
                    onValueChange={(v) => setSelectNbMonth(Number(v))}
                  >
                    <TabsList>
                      <TabsTrigger value={6}>6 mois</TabsTrigger>
                      <TabsTrigger value={12}>1 an</TabsTrigger>
                      <TabsTrigger value={24}>2 ans</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </Container>
            <div className="flex gap-4">
              <Container>
                <h2 className="text-left">Répartition finance</h2>
                {!isFetchingTransacs && !isFetchingInvests ? (
                  <RadialChart
                    chartData={chartDataRadial}
                    chartConfig={chartConfigRadial}
                    total={total}
                    legend={renderCustomLegend}
                    inner={40}
                    outer={55}
                    height={150}
                  />
                ) : (
                  <LoaderDots />
                )}
                <div className="flex flex-row justify-between w-3/4 max-w-[200px] mx-auto">
                  <div className="w-1/12">
                    <ChevronLeft
                      size={25}
                      onClick={clickLastMonth}
                      className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                    />
                  </div>
                  <p className="font-thin text-sm italic">
                    {convertDate(month)}
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
              <Container custom="h-fit">
                <div className="flex justify-between w-full gap-4">
                  <h2 className="text-left">Répartition patrimoine</h2>
                  <p
                    className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                    onClick={() => navigate(ROUTES.HERITAGE)}
                  >
                    Voir tout
                    <ChevronRight
                      size={12}
                      className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                    />
                  </p>
                </div>
                {!isFetchingTransacs ? ( // a revoir
                  <RadialChart
                    chartData={transformedDataAccount}
                    chartConfig={chartConfigAccount}
                    total={amountHeritage}
                    legend={renderCustomLegend}
                    inner={40}
                    outer={55}
                    height={150}
                  />
                ) : (
                  <LoaderDots />
                )}
              </Container>
              <Container custom="h-fit">
                <div className="flex justify-between w-full gap-4 mb-4">
                  <h2 className="text-left">Mes crédits</h2>
                  <p
                    className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                    onClick={() => navigate(ROUTES.CREDIT)}
                  >
                    Voir tout
                    <ChevronRight
                      size={12}
                      className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                    />
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dataCredit
                    ?.filter((cre) => cre.isActive === true)
                    ?.map((credit, index) => {
                      const typeInfo =
                        typeCreditList.find((t) => t.key === credit.type) || {};
                      const IconComponent =
                        Icons[typeInfo.icon] || Icons.CreditCard;

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="size-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: typeInfo.color || "#ccc",
                              }}
                            >
                              <IconComponent className="size-4" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm">{credit.name}</h3>
                              <p className="text-[10px] text-muted-foreground italic">
                                {typeInfo.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs italic">
                              {formatCurrency.format(credit.balance)}
                            </p>
                            <p className="text-[10px] text-muted-foreground italic">
                              {formatCurrency.format(
                                credit.monthlyPayment + credit.insurance
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Container>
            </div>
          </div>
          <div className="w-1/5 flex flex-col gap-4">
            <Container>
              <div className="flex justify-between w-full mb-4">
                <h2 className="text-nowrap">Dernieres transactions</h2>
                <p
                  className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                  onClick={() => navigate(ROUTES.TRANSACTIONS)}
                >
                  Voir tout
                  <ChevronRight
                    size={12}
                    className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                  />
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {lastTransactions.map((op) => (
                  <div
                    key={op._id}
                    className="flex items-center justify-between text-xs"
                  >
                    {" "}
                    <div className="flex flex-row space-x-4 w-4/5">
                      <span>{format(op.date, "dd/MM")}</span>
                      <span className="truncate">{op.title}</span>
                    </div>
                    <p
                      className={`px-2 py-[1px] text-[10px] italic rounded-md ${
                        op.type === TYPES.EXPENSE
                          ? "bg-colorExpense text-red-900"
                          : op.type === TYPES.INCOME &&
                            "bg-colorRevenue text-green-900"
                      }`}
                    >
                      {formatCurrency.format(op.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
            <Container>
              <div className="flex justify-between w-full mb-4">
                <h2 className="text-nowrap">Derniers investissements</h2>
                <p
                  className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                  onClick={() => navigate(ROUTES.INVESTMENT_IN_PROGRESS)}
                >
                  Voir tout
                  <ChevronRight
                    size={12}
                    className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                  />
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {lastInvestissements.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex items-center justify-between text-xs"
                  >
                    {" "}
                    <div className="flex flex-row space-x-4 w-4/5">
                      <span>{format(inv.date, "dd/MM")}</span>
                      <span className="truncate">{inv.title}</span>
                    </div>
                    <p className="text-[10px] italic">
                      {formatCurrency.format(inv.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
            <Container>
              <div className="flex justify-between w-full mb-4">
                <h2 className="text-nowrap">Mes investissements</h2>
                <p
                  className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                  onClick={() => navigate(ROUTES.INVESTMENT_ORDER)}
                >
                  Voir tout
                  <ChevronRight
                    size={12}
                    className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                  />
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {dataInvests
                  ?.sort((a, b) => b.amountBuy - a.amountBuy)
                  .slice(0, 4)
                  .map((item) => {
                    const category =
                      item?.type === "Crypto" ? "crypto" : "symbol";
                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Avatar className="size-6 mr-4">
                            <AvatarImage
                              src={`https://assets.parqet.com/logos/${category}/${item?.symbol}`}
                              alt={item?.name}
                            />
                          </Avatar>
                          <p className="text-xs">{item?.name}</p>
                        </div>
                        <p className="text-[10px] italic text-right">
                          {formatCurrency.format(item.amountBuy)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}

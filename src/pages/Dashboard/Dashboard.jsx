import { getLastOperations } from "../../utils/operations.js";
import {
  calculInvestByMonth,
  calculTotal,
  calculTotalByMonth,
} from "../../utils/calcul.js";
import { formatEuro } from "../../utils/fonctionnel.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ChartLine } from "../../composant/Charts/ChartLine.jsx";
import { categoryDepense } from "../../../public/categories.json";
import { currentDate, getLastMonths, months } from "../../utils/other.js";
import { fetchTransactions } from "../../Service/Transaction.service.jsx";
import { useQuery } from "@tanstack/react-query";
import Header from "../../composant/Header.jsx";
import { fetchInvestments } from "../../Service/Investment.service.jsx";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Loader from "../../composant/Loader/Loader.jsx";
import LoaderDots from "../../composant/Loader/LoaderDots.jsx";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";
import BoxInfos from "../../composant/Box/BoxInfos.jsx";
import { DollarSign } from "lucide-react";
import { WalletCards } from "lucide-react";
import { Landmark } from "lucide-react";
import { HandCoins } from "lucide-react";
import { useNavigate } from "react-router";
import { RadialChart } from "../../composant/Charts/RadialChart.jsx";
import { renderCustomLegend } from "../../composant/Legend.jsx";
import { fetchAccounts } from "../../Service/Epargn.service.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletMinimal } from "lucide-react";
import { ROUTES } from "../../composant/Routes.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    isLoading,
    data: dataTransac,
    isFetching,
  } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response.data;
    },
    refetchOnMount: true,
  });

  const { data: accounts } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const response = await fetchAccounts();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const { data: dataInvest } = useQuery({
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

  const dataTransacInvest = dataInvest?.flatMap((investment) => {
    return investment.transaction.map((trans) => ({
      title: investment.name,
      amount: trans.amount,
      date: trans.date,
    }));
  });

  const [selectNbMonth, setSelectNbMonth] = useState(6);

  const { month: currentMonth, year: currentYear } = currentDate();
  const currentYearMonth = `${currentYear}${currentMonth}`;

  const amountRevenuesMonth = calculTotalByMonth(
    dataTransac,
    "Revenue",
    currentYearMonth,
    null,
    null
  );
  const amountExpensesMonth = calculTotalByMonth(
    dataTransac,
    "Expense",
    currentYearMonth,
    null,
    null
  );

  const investCurrentMonth = calculTotal(dataTransacInvest);

  const getPreviousMonthAndYear = (month, year) => {
    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear -= 1;
    }
    return { previousMonth, previousYear };
  };

  const { previousMonth, previousYear } = getPreviousMonthAndYear(
    currentMonth,
    currentYear
  );

  const newPreviousMonth = String(previousMonth).padStart(2, "0");
  const previousDate = `${previousYear}${newPreviousMonth}`;
  const amountRevenuesLastMonth = calculTotalByMonth(
    dataTransac,
    "Revenue",
    previousDate,
    null,
    null
  );
  const amountExpensesLastMonth = calculTotalByMonth(
    dataTransac,
    "Expense",
    previousDate,
    null,
    null
  );

  const dataOperations = [
    ...(Array.isArray(dataTransac) ? dataTransac : []),
    ...(Array.isArray(dataTransacInvest) ? dataTransacInvest : []),
  ];

  const lastOperations = getLastOperations(dataOperations, null, 6, false);

  const formatData = (data) => {
    if (data === null || data === undefined) {
      return "0.00";
    }

    const cleanedData = String(data)
      .replace(/[^\d.-]/g, "")
      .replace(/ /g, "");
    const absoluteValue = Math.abs(parseFloat(cleanedData));

    return absoluteValue.toFixed(2);
  };

  const [month, setMonth] = useState(currentYearMonth);

  const clickLastMonth = () => {
    let yearNum = parseInt(month.slice(0, 4), 10);
    let monthNum = parseInt(month.slice(4), 10);
    monthNum -= 1;
    if (monthNum === 0) {
      monthNum = 12;
      yearNum -= 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setMonth(newDate);
  };

  const clickNextMonth = () => {
    let yearNum = parseInt(month.slice(0, 4), 10);
    let monthNum = parseInt(month.slice(4), 10);

    monthNum += 1;

    if (monthNum === 13) {
      monthNum = 1;
      yearNum += 1;
    }

    const newMonth = monthNum.toString().padStart(2, "0");

    const newDate = `${yearNum}${newMonth}`;
    setMonth(newDate);
  };

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
    dataTransac,
    "Expense",
    month,
    categoriesDf,
    null
  );
  const dataLoisir = calculTotalByMonth(
    dataTransac,
    "Expense",
    month,
    categoriesLoisir,
    null
  );

  const total = calculTotalByMonth(dataTransac, "Revenue", month);

  const montantInvest = calculInvestByMonth(dataTransacInvest, month);

  const [graphMonth, setGraphMonth] = useState(currentYearMonth);

  const clickNextMonthGraph = () => {
    let yearNum = parseInt(graphMonth.slice(0, 4), 10);
    let monthNum = parseInt(graphMonth.slice(4), 10);
    monthNum += 1;
    if (monthNum === 13) {
      monthNum = 1;
      yearNum += 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setGraphMonth(newDate);
  };

  const clickLastMonthGraph = () => {
    let yearNum = parseInt(graphMonth.slice(0, 4), 10);
    let monthNum = parseInt(graphMonth.slice(4), 10);
    monthNum -= 1;
    if (monthNum === 0) {
      monthNum = 12;
      yearNum -= 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setGraphMonth(newDate);
  };

  const monthsGraph = getLastMonths(graphMonth, selectNbMonth);

  const amountExpenseByMonth = [];
  const amountRevenueByMonth = [];
  const montantInvestByMonth = [];

  monthsGraph.forEach(({ code }) => {
    const amountExpenses = calculTotalByMonth(
      dataTransac,
      "Expense",
      code,
      null,
      null
    );
    const amountRevenues = calculTotalByMonth(
      dataTransac,
      "Revenue",
      code,
      null,
      null
    );
    const montantInvests = calculInvestByMonth(dataTransacInvest, code);

    amountExpenseByMonth.push(formatData(amountExpenses));
    amountRevenueByMonth.push(formatData(amountRevenues));
    montantInvestByMonth.push(formatData(montantInvests));
  });

  const dataGraph = monthsGraph.map((monthData, index) => ({
    month: monthData.month,
    year: monthData.year,
    amountExpense: amountExpenseByMonth[index],
    amountRevenue: amountRevenueByMonth[index],
    montantInvest: montantInvestByMonth[index],
  }));

  const defaultConfig = {
    amountRevenue: {
      label: "Revenu",
      color: "hsl(var(--graph-recette))",
      visible: true,
    },
    amountExpense: {
      label: "Dépense",
      color: "hsl(var(--graph-depense))",
      visible: true,
    },
    montantInvest: {
      label: "Investissements",
      color: "hsl(var(--graph-invest))",
      visible: true,
    },
    text: {
      color: "hsl(var(--foreground))",
    },
  };

  const firstMonthGraph = monthsGraph[0];
  const lastMonthGraph = monthsGraph[monthsGraph.length - 1];

  const theMonthGraph = `${firstMonthGraph.month} ${firstMonthGraph.year} - ${lastMonthGraph.month} ${lastMonthGraph.year}`;

  const chevronIsVisible = month < currentYearMonth;
  const chevronGraphIsVisible = lastMonthGraph.code < currentYearMonth;

  const dFix = parseFloat(Math.abs(dataDf));
  const dLoisir = parseFloat(Math.abs(dataLoisir));
  const mInvest = parseFloat(montantInvest);

  if (isLoading) return <Loader />;

  let epargne = total - (dFix + dLoisir + mInvest);

  if (epargne < 0) {
    epargne = 0;
  }

  const chartDataRadial = [
    {
      name: "Dépenses fixes",
      amount: dFix,
      pourcentage: (dFix / parseFloat(total)) * 100 || 0,
      fill: "var(--color-depensesFixes)",
    },
    {
      name: "Loisir",
      amount: dLoisir,
      pourcentage: (dLoisir / parseFloat(total)) * 100 || 0,
      fill: "var(--color-loisir)",
    },
    {
      name: "Investissements",
      amount: mInvest,
      pourcentage: (mInvest / parseFloat(total)) * 100 || 0,
      fill: "var(--color-invest)",
    },
    {
      name: "Épargne",
      amount: parseFloat(epargne),
      pourcentage: (parseFloat(epargne) / total) * 100 || 0,
      fill: "var(--color-epargne)",
    },
  ];

  const chartConfigRadial = {
    depensesFixes: {
      label: "Dépenses fixes",
      color: "hsl(var(--graph-depensesFixes))",
    },
    loisir: {
      label: "Loisir",
      color: "hsl(var(--graph-loisir))",
    },
    invest: {
      label: "Investissements",
      color: "hsl(var(--graph-invest))",
    },
    epargne: {
      label: "Épargne",
      color: "hsl(var(--graph-epargn))",
    },
  };

  const convertDate = (date) => {
    const year = Math.floor(date / 100);
    const month = date % 100;
    return `${months[month - 1]} ${year}`;
  };

  const maxValue = Math.max(
    ...dataGraph.map((item) =>
      Math.max(item?.amountExpense, item?.amountRevenue, item?.montantInvest)
    )
  );

  const amountEpargn = (accounts || []).reduce(
    (total, account) => total + account.balance,
    0
  );

  const amountInvestAll = Array.isArray(dataInvest)
    ? dataInvest.reduce((total, item) => {
        return total + (parseFloat(item?.amountBuy) || 0);
      }, 0)
    : 0;

  const amountHeritage = amountInvestAll + amountEpargn;

  return (
    <>
      <section className="w-full">
        <Header title="Tableau de bord" isFetching={isFetching} />
        <div className="flex flex-col gap-4 animate-fade">
          <div className="flex gap-4 w-full">
            <BoxInfos
              onClick={() => navigate(ROUTES.REVENUE)}
              type="revenue"
              title="Revenu"
              icon={<DollarSign size={15} color="grey" />}
              value={amountRevenuesMonth}
              valueLast={amountRevenuesLastMonth}
              isAmount
            />
            <BoxInfos
              onClick={() => navigate(ROUTES.EXPENSE)}
              type="depense"
              title="Dépense"
              icon={<WalletCards size={15} color="grey" />}
              value={amountExpensesMonth}
              valueLast={amountExpensesLastMonth}
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
              value={amountEpargn.toFixed(2)}
              isAmount
            />
            <BoxInfos
              onClick={() => navigate(ROUTES.HERITAGE)}
              title="Patrimoine"
              icon={<WalletMinimal size={15} color="grey" />}
              value={amountHeritage.toFixed(2)}
              isAmount
            />
          </div>
          <div className="flex flex-row gap-4 h-full">
            <div className="w-2/5 flex flex-col h-fit gap-4">
              <div className="bg-primary-foreground h-fit ring-1 ring-border rounded-xl p-4 flex flex-col gap-4">
                <h2 className="text-left">Dernières opérations</h2>
                <table className="h-full">
                  <tbody className="w-full gap-2 h-full flex flex-col">
                    {lastOperations.map((operation) => (
                      <tr
                        key={operation._id}
                        className=" w-full rounded-lg h-full flex flex-row items-center text-xs"
                      >
                        <td className="flex flex-row space-x-4 w-full">
                          <span>{format(operation.date, "dd/MM")}</span>
                          <span className="truncate">{operation.title}</span>
                        </td>

                        <p
                          className={`w-fit px-2 py-[1px] text-[10px] italic text-nowrap rounded-sm ${
                            operation.type === "Expense"
                              ? "bg-red-300 text-red-900 dark:bg-red-300 dark:text-red-900"
                              : operation.type === "Revenue"
                                ? "bg-green-300 text-green-900 dark:bg-green-300 dark:text-green-900"
                                : "bg-blue-300 text-blue-900 dark:bg-blue-300 dark:text-blue-900"
                          }`}
                        >
                          {formatEuro.format(operation.amount)}
                        </p>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-primary-foreground ring-1 ring-border rounded-xl p-4 flex flex-col gap-4">
                <div className="flex justify-between w-full gap-4">
                  <h2 className="text-nowrap">Mes investissements</h2>
                  <p
                    className="flex items-center font-thin italic text-nowrap gap-1 group text-[10px] cursor-pointer transition-all"
                    onClick={() => navigate(ROUTES.INVESTMENT_ORDER)}
                  >
                    Voir plus
                    <ChevronRight
                      size={12}
                      className="translate-x-0 scale-0 group-hover:translate-x-[1px] group-hover:scale-100 transition-all"
                    />
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {dataInvest
                    ?.sort((a, b) => b.amountBuy - a.amountBuy)
                    .slice(0, 3)
                    .map((item) => {
                      const category =
                        item?.type === "Crypto" ? "crypto" : "symbol";
                      return (
                        <div
                          key={item?.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Avatar className="size-6 mr-4">
                              <AvatarImage
                                src={`https://assets.parqet.com/logos/${category}/${item?.symbol}`}
                                alt={item?.name}
                              />
                            </Avatar>
                            <p className="text-xs ">{item?.name}</p>
                          </div>

                          <div className="text-xs text-right">
                            <p>{formatEuro.format(item.amountBuy)}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="w-full relative h-fit flex flex-col justify-between bg-primary-foreground ring-1 ring-border rounded-xl p-4">
              <h2 className=" text-left">Graphique</h2>
              {!isFetching ? (
                <ChartLine
                  data={dataGraph}
                  defaultConfig={defaultConfig}
                  maxValue={maxValue}
                />
              ) : (
                <LoaderDots />
              )}
              <div className="flex flex-row w-4/5 mx-auto px-20 items-center justify-between bottom-2">
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
                  </Tabs>{" "}
                </div>
              </div>
            </div>
            <div className="w-2/4 bg-primary-foreground ring-1 ring-border rounded-xl h-full p-4">
              <h2 className=" text-left">Répartitions</h2>
              {!isFetching ? (
                total !== "0.00" ? (
                  <RadialChart
                    chartData={chartDataRadial}
                    chartConfig={chartConfigRadial}
                    total={total}
                    legend={renderCustomLegend}
                    inner={40}
                    outer={55}
                  />
                ) : (
                  <p className="h-[225px] ">Aucune donnée</p>
                )
              ) : (
                <LoaderDots />
              )}

              <div className="flex flex-row justify-between w-3/4 mx-auto">
                <div className="w-1/12">
                  <ChevronLeft
                    size={25}
                    onClick={clickLastMonth}
                    className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                  />
                </div>

                <p className="font-thin text-sm w-10/12 italic">
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
            </div>
          </div>
          <div className="flex flex-row gap-4 h-full"></div>
        </div>
      </section>
    </>
  );
}

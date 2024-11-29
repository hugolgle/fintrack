import { getLastOperations } from "../../utils/operations.js";
import {
  calculEconomie,
  calculInvestByMonth,
  calculTotalByMonth,
} from "../../utils/calcul.js";
import { addSpace, formatAmountWithoutSpace } from "../../utils/fonctionnel.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ChartLine } from "../../composant/Charts/ChartLine.jsx";
import { categoryDepense } from "../../../public/categories.json";
import { currentDate, getLastMonths, months } from "../../utils/other.js";
import { fetchTransactions } from "../../Service/Transaction.service.jsx";
import { useQuery } from "@tanstack/react-query";
import Header from "../../composant/Header.jsx";
import { fetchInvestments } from "../../Service/Investment.service.jsx";
import Loader from "../../composant/Loader/Loader.jsx";
import LoaderDots from "../../composant/Loader/LoaderDots.jsx";
import { HttpStatusCode } from "axios";
import { Dot } from "lucide-react";
import { format } from "date-fns";
import BoxInfos from "../../composant/Box/BoxInfos.jsx";
import { DollarSign } from "lucide-react";
import { WalletCards } from "lucide-react";
import { Landmark } from "lucide-react";
import { HandCoins } from "lucide-react";
import { useNavigate } from "react-router";
import { RadialChart } from "../../composant/Charts/RadialChart.jsx";
import { renderCustomLegend } from "../../composant/Legend.jsx";

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
    staleTime: 60_000,
  });

  const dataTransacInvest = dataInvest?.flatMap((investment) => {
    return investment.transaction.map((trans) => ({
      title: investment.name,
      amount: trans.amount,
      date: trans.date,
    }));
  });

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

  const investCurrentMonth = calculInvestByMonth(
    dataTransacInvest,
    currentYearMonth
  );

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

  const economieCurrentMonth = calculEconomie(
    dataTransac,
    `${currentYear}`,
    currentMonth
  );

  const economyCurrentMonth = formatAmountWithoutSpace(economieCurrentMonth);

  const investLastMonth = calculInvestByMonth(dataTransacInvest, previousDate);

  const dataOperations = [
    ...(Array.isArray(dataTransac) ? dataTransac : []),
    ...(Array.isArray(dataTransacInvest) ? dataTransacInvest : []),
  ];

  const lastOperations = getLastOperations(dataOperations, null, 8, false);

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

  const monthsGraph = getLastMonths(graphMonth, 6);

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
      label: "Recette",
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
      pourcentage: (dFix / parseFloat(formatAmountWithoutSpace(total))) * 100,
      fill: "var(--color-depensesFixes)",
    },
    {
      name: "Loisir",
      amount: dLoisir,
      pourcentage:
        (dLoisir / parseFloat(formatAmountWithoutSpace(total))) * 100,
      fill: "var(--color-loisir)",
    },
    {
      name: "Investissements",
      amount: mInvest,
      pourcentage:
        (mInvest / parseFloat(formatAmountWithoutSpace(total))) * 100,
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
      Math.max(item.amountExpense, item.amountRevenue, item.montantInvest)
    )
  );

  return (
    <>
      <section className="w-full">
        <Header title="Tableau de bord" isFetching={isFetching} />
        <div className="flex flex-col gap-4 animate-fade">
          <div className="flex gap-4 w-full">
            <BoxInfos
              onClick={() => navigate("/revenue")}
              type="revenue"
              title="Revenu"
              icon={<DollarSign size={15} color="grey" />}
              value={amountRevenuesMonth}
              valueLast={amountRevenuesLastMonth}
              isAmount
            />

            <BoxInfos
              onClick={() => navigate("/expense")}
              type="depense"
              title="Dépense"
              icon={<WalletCards size={15} color="grey" />}
              value={amountExpensesMonth}
              valueLast={amountExpensesLastMonth}
              isAmount
            />
            <BoxInfos
              onClick={() => navigate("/investment")}
              type="investment"
              title="Investissement"
              icon={<HandCoins size={15} color="grey" />}
              value={investCurrentMonth}
              valueLast={investLastMonth}
              isAmount
            />
            <BoxInfos
              type="economy"
              title="Épargne"
              icon={<Landmark size={15} color="grey" />}
              value={economyCurrentMonth}
              isAmount
            />
          </div>
          <div className="flex flex-row gap-4 h-full">
            <div className="w-2/5 bg-primary-foreground rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-xl font-extralight italic">
                Dernières opérations
              </h2>
              <table className="h-full">
                <tbody className="w-full h-full flex flex-col">
                  {lastOperations.map((operation) => (
                    <tr
                      key={operation._id}
                      className="justify-between rounded-lg h-full flex flex-row items-center text-xs"
                    >
                      <td className="flex flex-row space-x-4 w-full">
                        <span>{format(operation.date, "dd/MM")}</span>
                        <span className="truncate">{operation.title}</span>
                      </td>
                      <td className="flex items-center flex-row w-full">
                        <td className="w-full text-right italic">
                          <b>{addSpace(operation.amount)} €</b>
                        </td>
                        <Dot
                          strokeWidth={6}
                          color={
                            operation.type === "Revenue"
                              ? "hsl(var(--graph-recette))"
                              : operation.type === "Expense"
                                ? "hsl(var(--graph-depense))"
                                : "hsl(var(--graph-invest))"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full flex flex-col justify-between bg-primary-foreground rounded-xl p-4">
              <h2 className="text-xl font-extralight italic">Graphique</h2>
              {!isFetching ? (
                <ChartLine
                  data={dataGraph}
                  defaultConfig={defaultConfig}
                  maxValue={maxValue}
                />
              ) : (
                <LoaderDots />
              )}{" "}
              <div
                className={`flex flex-row gap-4 min-w-fit w-4/5 mx-auto px-20 items-center justify-between bottom-2`}
              >
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
            </div>
            <div className="w-2/4 bg-primary-foreground rounded-xl p-4">
              <h2 className="text-xl font-extralight italic">Répartitions</h2>
              {!isFetching ? (
                <RadialChart
                  chartData={chartDataRadial}
                  chartConfig={chartConfigRadial}
                  total={total}
                  legend={renderCustomLegend}
                  inner={40}
                  outer={55}
                />
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

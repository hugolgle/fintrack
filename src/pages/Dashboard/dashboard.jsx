import { getLastOperations } from "../../utils/operations";
import {
  calculEconomie,
  calculInvestByMonth,
  calculTotalByMonth,
} from "../../utils/calcul";
import {
  addSpace,
  convertDate,
  formatAmountWithoutSpace,
  removeSpace,
} from "../../utils/fonctionnel";
import { CamembertTdb } from "../../composant/Charts/camembertTdb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { GraphiqueTdb } from "../../composant/Charts/graphiqueTdb";
import { categoryDepense } from "../../../public/categories.json";
import { currentDate, getLastMonths } from "../../utils/other";
import { fetchTransactions } from "../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import Header from "../../composant/header";
import { fetchInvestments } from "../../service/investment.service";
import Loader from "../../composant/loader/loader";
import LoaderDots from "../../composant/loader/loaderDots";
import { useTheme } from "../../context/ThemeContext";
import { HttpStatusCode } from "axios";
import { Dot } from "lucide-react";
import { format } from "date-fns";
import BoxInfos from "../../composant/boxInfos";
import { DollarSign } from "lucide-react";
import { WalletCards } from "lucide-react";
import { Landmark } from "lucide-react";
import { HandCoins } from "lucide-react";
import { useNavigate } from "react-router";

export default function TableauDeBord() {
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

  const epargnCurrentMonth =
    formatAmountWithoutSpace(economieCurrentMonth) -
    formatAmountWithoutSpace(investCurrentMonth);

  const investLastMonth = calculInvestByMonth(dataTransacInvest, previousDate);

  const economieLastMonth = calculEconomie(
    dataTransac,
    `${previousYear}`,
    newPreviousMonth
  );

  const epargnLastMonth = economieLastMonth - investLastMonth;
  console.log(epargnLastMonth);
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

  const total = calculTotalByMonth(dataTransac, "Revenue", month, null, null);

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

  const firstMonthGraph = monthsGraph[0];
  const lastMonthGraph = monthsGraph[monthsGraph.length - 1];

  const theMonthGraph = `${firstMonthGraph.month} ${firstMonthGraph.year} - ${lastMonthGraph.month} ${lastMonthGraph.year}`;

  // -------------- bgColor --------------

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";
  const chevronIsVisible = month < currentYearMonth;

  // ------------ loader ------------

  if (isLoading) return <Loader />;
  console.log(epargnCurrentMonth);
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
            />

            <BoxInfos
              onClick={() => navigate("/expense")}
              type="depense"
              title="Dépense"
              icon={<WalletCards size={15} color="grey" />}
              value={amountExpensesMonth}
              valueLast={amountExpensesLastMonth}
            />
            <BoxInfos
              type="epargn"
              title="Épargne"
              icon={<Landmark size={15} color="grey" />}
              value={epargnCurrentMonth}
              valueLast={epargnLastMonth}
            />
            <BoxInfos
              onClick={() => navigate("/investment")}
              type="investment"
              title="Investissement"
              icon={<HandCoins size={15} color="grey" />}
              value={investCurrentMonth}
              valueLast={investLastMonth}
            />
          </div>
          <div className="flex flex-row gap-4 h-full">
            <div
              className={`w-1/4 ${bgColor} rounded-xl p-4 flex flex-col gap-4`}
            >
              <h2 className="text-2xl font-extralight italic">
                Dernières opérations
              </h2>
              <table className="h-full">
                <tbody className="w-full h-full flex flex-col">
                  {lastOperations.map((operation) => (
                    <tr
                      key={operation._id}
                      className="relative rounded-lg h-full flex flex-row items-center py-1 text-sm"
                    >
                      <Dot
                        className="absolute right-0"
                        size={40}
                        color={
                          operation.type === "Revenue"
                            ? "hsl(var(--graph-recette))"
                            : operation.type === "Expense"
                              ? "hsl(var(--graph-depense))"
                              : "hsl(var(--graph-invest))"
                        }
                      />
                      <td className="flex flex-row space-x-4 w-full">
                        <span>{format(operation.date, "dd/MM")}</span>
                        <span className="truncate">{operation.title}</span>
                      </td>
                      <td className="w-full italic">
                        <b>{addSpace(operation.amount)} €</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`w-2/4 ${bgColor} rounded-xl p-4`}>
              <h2 className="text-2xl font-extralight italic">Graphique</h2>
              {!isFetching ? (
                <GraphiqueTdb data={dataGraph} />
              ) : (
                <LoaderDots />
              )}{" "}
              <div
                className={`flex flex-row gap-4 min-w-fit w-4/5 mx-auto px-20 items-center justify-between bottom-2`}
              >
                <ChevronLeft
                  size={25}
                  className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                  onClick={clickLastMonthGraph}
                />
                <p className="font-thin text-sm w-10/12 italic">
                  {theMonthGraph}
                </p>
                <ChevronRight
                  size={25}
                  className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black p-1 rounded-full cursor-pointer duration-300 transition-all"
                  onClick={clickNextMonthGraph}
                />
              </div>
            </div>
            <div className={`w-1/4 ${bgColor} rounded-xl p-4`}>
              <h2 className="text-2xl font-extralight italic">Répartitions</h2>

              {!isFetching ? (
                <CamembertTdb
                  dataDf={formatData(dataDf)}
                  dataLoisir={formatData(dataLoisir)}
                  dataInvest={montantInvest}
                  total={formatData(total)}
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

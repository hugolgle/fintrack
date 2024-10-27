import { getLastTransactionsByType } from "../../utils/operations";
import {
  calculEconomie,
  calculInvestByMonth,
  calculTotalByMonth,
} from "../../utils/calcul";
import {
  addSpace,
  convertDate,
  convertirFormatDate,
} from "../../utils/fonctionnel";
import { CamembertTdb } from "../../composant/Charts/camembertTdb";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { GraphiqueTdb } from "../../composant/Charts/graphiqueTdb";
import { categoryDepense } from "../../../public/categories.json";
import { getLastSixMonths } from "../../utils/other";
import BoxTdb from "../../composant/Box/boxDB";
import { fetchTransactions } from "../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import Header from "../../composant/header";
import { fetchInvestments } from "../../service/investment.service";
import Loader from "../../composant/loader";

export default function TableauDeBord() {
  const { isLoading, data: dataTransac } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
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

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }

      return response?.data;
    },
    refetchOnMount: true,
  });

  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    return { month: currentMonth, year: currentYear };
  };

  const { month: currentMonth, year: currentYear } = getCurrentMonthAndYear();

  const newCurrentMonth = String(currentMonth).padStart(2, "0");
  const currentDate = `${currentYear}${newCurrentMonth}`;

  const amountRevenuesMonth = calculTotalByMonth(
    dataTransac,
    "Revenue",
    currentDate,
    null,
    null
  );
  const amountExpensesMonth = calculTotalByMonth(
    dataTransac,
    "Expense",
    currentDate,
    null,
    null
  );

  const InvestCurrentMonth = calculInvestByMonth(dataInvest, currentDate);

  const getPreviousMonthAndYear = (month, year) => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    return { month: prevMonth, year: prevYear };
  };

  const { month: previousMonth, year: previousYear } = getPreviousMonthAndYear(
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

  const economiesCurrentMonth = calculEconomie(
    dataTransac,
    `${currentYear}`,
    newCurrentMonth
  );

  const investLastMonth = calculInvestByMonth(dataInvest, previousDate);

  const economieLastMonth = calculEconomie(
    dataTransac,
    `${previousYear}`,
    newPreviousMonth
  );

  const lastTransactions = getLastTransactionsByType(
    dataTransac,
    null,
    6,
    false
  );

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

  const [month, setMonth] = useState(currentDate);

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

  const montantInvest = calculInvestByMonth(dataInvest, month);

  const [graphMonth, setGraphMonth] = useState(currentDate);

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

  const lastSixMonths = getLastSixMonths(graphMonth);

  const amountExpenseByMonth = [];
  const amountRevenueByMonth = [];
  const montantInvestByMonth = [];

  lastSixMonths.forEach(({ code }) => {
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
    const montantInvests = calculInvestByMonth(dataInvest, code);

    amountExpenseByMonth.push(formatData(amountExpenses));
    amountRevenueByMonth.push(formatData(amountRevenues));
    montantInvestByMonth.push(formatData(montantInvests));
  });

  const dataGraph = lastSixMonths.map((monthData, index) => ({
    month: monthData.month,
    year: monthData.year,
    amountExpense: amountExpenseByMonth[index],
    amountRevenue: amountRevenueByMonth[index],
    montantInvest: montantInvestByMonth[index],
  }));

  const firstMonth = lastSixMonths[0];

  const lastMonth = lastSixMonths[lastSixMonths.length - 1];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <section className="w-full">
        <Header title="Tableau de bord" />
        <div className="flex flex-col gap-4 animate-fade">
          <div className="flex flex-row gap-4 h-full">
            <div className="w-full bg-colorSecondaryLight dark:bg-colorPrimaryDark h-full rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-3xl font-extralight italic">
                Dernières transactions
              </h2>
              <table className="h-full">
                <tbody className="w-full h-full flex flex-col gap-2">
                  {lastTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className={`bg-opacity-15 rounded-lg h-full flex flex-row items-center py-1 text-sm ${transaction.type === "Revenue" ? "bg-green-600" : transaction.type === "Expense" ? "bg-red-600" : ""}`}
                    >
                      <td className="w-full">
                        {convertirFormatDate(transaction.date)}
                      </td>
                      <td className="w-full truncate">{transaction.title}</td>
                      <td className="w-full">{transaction.category}</td>
                      <td className="w-full">
                        <b>{addSpace(transaction.amount)} €</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-2/3 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl p-4 flex flex-col gap-4">
              <BoxTdb
                title="Mois actuel"
                amountExpense={amountExpensesMonth}
                amountRevenue={amountRevenuesMonth}
                montantEconomie={economiesCurrentMonth}
                montantInvest={InvestCurrentMonth}
              />
            </div>
            <div className="w-2/3 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl p-4 flex flex-col gap-4">
              <BoxTdb
                title="Mois dernier"
                amountExpense={amountExpensesLastMonth}
                amountRevenue={amountRevenuesLastMonth}
                montantEconomie={economieLastMonth}
                montantInvest={investLastMonth}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4 h-full">
            <div className="w-7/12 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl h-full p-4 relative">
              <h2 className="text-3xl font-extralight italic">Graphique</h2>
              <GraphiqueTdb data={dataGraph} />
              <div
                className={`flex flex-row gap-4 min-w-fit w-3/5 mx-auto px-20 items-center justify-between bottom-2`}
              >
                <ChevronLeft
                  size={30}
                  className="hover:bg-colorPrimaryLight hover:dark:bg-colorSecondaryDark rounded-full p-2 cursor-pointer duration-300 transition-all"
                  onClick={clickLastMonthGraph}
                />
                <p className="text-sm italic">
                  {firstMonth.month} {firstMonth.year} - {lastMonth.month}{" "}
                  {lastMonth.year}
                </p>
                <ChevronRight
                  size={30}
                  className="hover:bg-colorPrimaryLight hover:dark:bg-colorSecondaryDark rounded-full p-2 cursor-pointer duration-300 transition-all"
                  onClick={clickNextMonthGraph}
                />
              </div>
            </div>
            <div className="w-5/12 bg-colorSecondaryLight  dark:bg-colorPrimaryDark rounded-xl p-4">
              <h2 className="text-3xl font-extralight italic">Répartitions</h2>
              <div className="flex flex-row justify-between w-full py-3 px-16">
                <ChevronLeft
                  size={30}
                  onClick={clickLastMonth}
                  className="hover:bg-colorPrimaryLight hover:dark:bg-colorSecondaryDark rounded-full p-2 cursor-pointer duration-300 transition-all"
                />
                <p className="font-thin italic">{convertDate(month)}</p>
                <ChevronRight
                  size={30}
                  onClick={clickNextMonth}
                  className={`hover:bg-colorPrimaryLight hover:dark:bg-colorSecondaryDark rounded-full p-2 cursor-pointer duration-300 transition-all ${month >= currentDate ? "invisible" : ""}`}
                />
              </div>
              <CamembertTdb
                dataDf={formatData(dataDf)}
                dataLoisir={formatData(dataLoisir)}
                dataInvest={montantInvest}
                total={formatData(total)}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

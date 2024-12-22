import { useNavigate } from "react-router-dom";

import {
  calculTotal,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../utils/calcul";
import {
  categoryDepense,
  categoryRecette,
} from "../../../public/categories.json";
import { currentDate, getLastMonths, months } from "../../utils/other";
import { fetchTransactions } from "../../Service/Transaction.service";
import { useQuery } from "@tanstack/react-query";
import Header from "../../composant/Header.jsx";
import { ChartLine } from "../../composant/Charts/ChartLine.jsx";
import Loader from "../../composant/Loader/Loader";
import { HttpStatusCode } from "axios";
import { DollarSign, Calendar, PieChart } from "lucide-react";
import BoxInfos from "../../composant/Box/BoxInfos";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  aggregateTransactions,
  getLastOperations,
  getTransactionsByMonth,
} from "../../utils/operations.js";
import { renderCustomLegend } from "../../composant/Legend.jsx";
import { RadialChart } from "../../composant/Charts/RadialChart.jsx";
import LoaderDots from "../../composant/Loader/LoaderDots.jsx";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../../utils/fonctionnel.js";

export default function BoardTransactions({ type }) {
  const { month, year } = currentDate();
  const currentYearMonth = `${year}${month}`;
  const [selectNbMonth, setSelectNbMonth] = useState(6);
  const [graphMonth, setGraphMonth] = useState(currentYearMonth);
  const [monthChartRadial, setMonth] = useState(currentYearMonth);
  const navigate = useNavigate();
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

  if (isLoading) return <Loader />;

  let lastYear = year;
  let lastMonth = month - 1;

  if (lastMonth === 0) {
    lastMonth = 12;
    lastYear -= 1;
  }

  lastMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth;

  const lastMonthYear = `${lastYear}${lastMonth}`;

  const revenuePieChartMonth = getTransactionsByMonth(
    dataTransactions,
    monthChartRadial,
    type
  );

  const chartData = aggregateTransactions(revenuePieChartMonth);
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

  const categoryTransaction =
    type === "Expense" ? categoryDepense : categoryRecette;

  const categoryColorsTransaction = categoryTransaction.reduce(
    (acc, category) => {
      acc[category.name] = category.color;
      return acc;
    },
    {}
  );

  const transformedData = chartData.map((item) => ({
    name: item.nomCate,
    amount: item.amount,
    pourcentage: (item.amount / totalAmount) * 100,
    fill: categoryColorsTransaction[item.nomCate],
  }));

  const chartConfig = {
    ...Object.keys(categoryColorsTransaction).reduce((acc, category) => {
      acc[category.toLocaleLowerCase()] = {
        label: category,
        color: categoryColorsTransaction[category],
      };
      return acc;
    }, {}),
  };

  const defaultConfig = {
    amount: {
      label: type === "Expense" ? "Dépense" : "Revenu",
      color:
        type === "Expense"
          ? "hsl(var(--graph-expense))"
          : "hsl(var(--graph-revenue))",
      visible: true,
    },
    text: {
      color: "hsl(var(--foreground))",
    },
  };

  const amountMonth = [];

  const monthsGraph = getLastMonths(graphMonth, selectNbMonth);

  monthsGraph.forEach(({ code }) => {
    const amount = calculTotalByMonth(dataTransactions, type, code, null, null);
    amountMonth.push(Math.abs(amount));
  });

  const dataGraph = monthsGraph.map((monthData, index) => ({
    month: monthData.month,
    year: monthData.year,
    amount: amountMonth[index],
  }));

  const maxValue = Math.max(...dataGraph.map((item) => Math.max(item.amount)));

  const dataOperations = [
    ...(Array.isArray(dataTransactions) ? dataTransactions : []),
  ];

  const lastOperations = getLastOperations(dataOperations, type, 6, false);

  const convertDate = (date) => {
    const annee = Math.floor(date / 100);
    const mois = date % 100;
    return `${months[mois - 1]} ${annee}`;
  };

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

  const firstMonthGraph = monthsGraph[0];
  const lastMonthGraph = monthsGraph[monthsGraph.length - 1];

  const theMonthGraph = `${firstMonthGraph.month} ${firstMonthGraph.year} - ${lastMonthGraph.month} ${lastMonthGraph.year}`;

  const clickLastMonth = () => {
    let yearNum = parseInt(monthChartRadial.slice(0, 4), 10);
    let monthNum = parseInt(monthChartRadial.slice(4), 10);
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
    let yearNum = parseInt(monthChartRadial.slice(0, 4), 10);
    let monthNum = parseInt(monthChartRadial.slice(4), 10);

    monthNum += 1;

    if (monthNum === 13) {
      monthNum = 1;
      yearNum += 1;
    }

    const newMonth = monthNum.toString().padStart(2, "0");

    const newDate = `${yearNum}${newMonth}`;
    setMonth(newDate);
  };

  const chevronIsVisible = monthChartRadial < currentYearMonth;
  const chevronGraphIsVisible = lastMonthGraph.code < currentYearMonth;
  const total = calculTotalByMonth(
    dataTransactions,
    type,
    monthChartRadial,
    null,
    null
  );

  return (
    <>
      <section className="w-full">
        <div className="flex flex-col">
          <Header
            title={type === "Expense" ? "Dépenses" : "Revenus"}
            btnAdd="add"
            isFetching={isFetching}
          />

          <div className="flex gap-4 w-full animate-fade">
            <div className="flex flex-col gap-4 w-4/5">
              <div className="flex gap-4">
                <BoxInfos
                  onClick={() =>
                    navigate(`/${type.toLowerCase()}/${currentYearMonth}`)
                  }
                  title={
                    type === "Expense"
                      ? "Dépenses ce mois"
                      : type === "Revenue" && "Revenus ce mois"
                  }
                  value={calculTotalByMonth(
                    dataTransactions,
                    type,
                    currentYearMonth
                  )}
                  valueLast={
                    calculTotalByMonth(dataTransactions, type, lastMonthYear) ||
                    null
                  }
                  icon={<Calendar size={15} color="grey" />}
                  isAmount
                />
                <BoxInfos
                  onClick={() => navigate(`/${type.toLowerCase()}/${year}`)}
                  title={
                    type === "Expense"
                      ? "Dépenses cette année"
                      : type === "Revenue" && "Revenus cette année"
                  }
                  value={calculTotalByYear(dataTransactions, type, year)}
                  valueLast={
                    calculTotalByYear(dataTransactions, type, year - 1) || null
                  }
                  icon={<PieChart size={15} color="grey" />}
                  year
                  isAmount
                />
                <BoxInfos
                  onClick={() => navigate(`/${type.toLowerCase()}/all`)}
                  title={
                    type === "Expense"
                      ? "Dépenses totales"
                      : type === "Revenue" && "Revenus totals"
                  }
                  value={calculTotal(dataTransactions, type)}
                  icon={<DollarSign size={15} color="grey" />}
                  isAmount
                />
              </div>
              <div className="flex gap-4">
                <div className="w-2/4 ring-1 ring-border bg-secondary rounded-xl p-4">
                  <h2 className=" text-left">Répartitions</h2>
                  {!isFetching ? (
                    total !== "0.00" ? (
                      <RadialChart
                        chartData={transformedData}
                        chartConfig={chartConfig}
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
                </div>
                <div className="w-full relative flex flex-col ring-1 ring-border justify-between bg-secondary rounded-xl p-4">
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
                  <div className="flex flex-row min-w-fit w-4/5 mx-auto px-20 items-center justify-between bottom-2">
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
                </div>
              </div>
            </div>
            <div className="w-1/5 flex flex-col gap-4">
              <div className="bg-secondary ring-1 ring-border rounded-xl h-fit p-4 flex flex-col gap-4 ">
                <h2 className=" text-left">Dernières opérations</h2>
                <table className="h-full">
                  <tbody className="w-full h-full gap-2 flex flex-col">
                    {lastOperations.map((operation) => (
                      <tr
                        key={operation._id}
                        className="justify-between rounded-lg h-full flex flex-row items-center text-xs"
                      >
                        <td className="flex flex-row space-x-4 w-full">
                          <span>{format(operation.date, "dd/MM")}</span>
                          <span className="truncate">{operation.title}</span>
                        </td>

                        <td
                          className={`w-fit px-2 py-[1px] text-[10px] italic text-nowrap rounded-sm ${
                            operation.type === "Expense"
                              ? "bg-colorExpense text-red-900 dark:bg-colorExpense dark:text-red-900"
                              : operation.type === "Revenue" &&
                                "bg-colorRevenue text-green-900 dark:bg-colorRevenue dark:text-green-900"
                          }`}
                        >
                          <span>{formatCurrency.format(operation.amount)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { useQuery } from "@tanstack/react-query";
import { fetchInvestments } from "../../Service/Investment.service";
import Header from "../../composant/Header.jsx";
import { toast } from "sonner";
import Loader from "../../composant/Loader/Loader";
import { useTheme } from "../../Context/ThemeContext";
import { HttpStatusCode } from "axios";
import { Pickaxe } from "lucide-react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { addSpace, formatAmount } from "../../utils/fonctionnel";
import { BookA } from "lucide-react";
import BoxInfos from "../../composant/Box/BoxInfos";
import { RadialChart } from "../../composant/Charts/RadialChart.jsx";
import { useNavigate } from "react-router";
import { useState } from "react";
import { renderCustomLegend } from "../../composant/Legend.jsx";
import LoaderDots from "../../composant/Loader/LoaderDots";
import { currentDate, getLastMonths } from "../../utils/other.js";
import { getLastOperations } from "../../utils/operations.js";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import { ChartLine } from "../../composant/Charts/ChartLine.jsx";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { calculInvestByMonth } from "../../utils/calcul.js";

export default function BoardInvest() {
  const navigate = useNavigate();
  const { isLoading, data, isFetching } = useQuery({
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

  const { month: currentMonth, year: currentYear } = currentDate();
  const currentYearMonth = `${currentYear}${currentMonth}`;
  const [graphMonth, setGraphMonth] = useState(currentYearMonth);

  const amountBuy = Array.isArray(data)
    ? data.reduce((total, item) => {
        return total + (parseFloat(item.amountBuy) || 0);
      }, 0)
    : 0;

  const amountSale = Array.isArray(data)
    ? data.reduce((total, item) => {
        return total + (parseFloat(item.amountSale) || 0);
      }, 0)
    : 0;

  const amountResult = Array.isArray(data)
    ? data.reduce((total, item) => {
        return total + (parseFloat(item.amountResult) || 0);
      }, 0)
    : 0;

  if (isLoading) return <Loader />;

  const totalAmountBuy = data.reduce(
    (total, item) => total + (parseFloat(item.amountBuy) || 0),
    0
  );

  const categorySums = data.reduce((acc, investment) => {
    const type = investment.type;
    const amountBuy = parseFloat(investment.amountBuy) || 0;

    if (acc[type]) {
      acc[type].amount += amountBuy;
    } else {
      acc[type] = {
        category: type,
        amount: amountBuy,
      };
    }
    return acc;
  }, {});

  const titleSums = data.reduce((acc, investment) => {
    const name = investment.name;
    const amountBuy = parseFloat(investment.amountBuy) || 0;

    if (acc[name]) {
      acc[name].amount += amountBuy;
    } else {
      acc[name] = {
        name: name,
        amount: amountBuy,
      };
    }
    return acc;
  }, {});

  const chartDataByType = Object.values(categorySums).map((category, key) => {
    const pourcentage = (category.amount / totalAmountBuy) * 100;
    return {
      name: category.category,
      amount: category.amount,
      pourcentage: pourcentage,
      fill: `hsl(var(--chart-${key}))`,
    };
  });

  const chartConfigByType = Object.values(categorySums).reduce(
    (config, category, key) => {
      config[category.category] = {
        label: category.category,
        color: `hsl(var(--chart-${key}))`,
      };
      return config;
    },
    {}
  );

  const chartDataByName = Object.values(titleSums).map((title, key) => {
    const pourcentage = (title.amount / totalAmountBuy) * 100;
    return {
      name: title.name,
      amount: title.amount,
      pourcentage: pourcentage,
      fill: `hsl(var(--chart-${key}))`,
    };
  });

  const chartConfigByName = Object.values(titleSums).reduce(
    (config, title, key) => {
      config[title.name] = {
        label: title.name,
        color: `hsl(var(--chart-${key}))`,
      };
      return config;
    },
    {}
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

  const monthsGraph = getLastMonths(graphMonth, 6);

  const montantInvestByMonth = [];
  const dataTransacInvest = data?.flatMap((investment) => {
    return investment.transaction.map((trans) => ({
      title: investment.name,
      amount: trans.amount,
      date: trans.date,
    }));
  });

  monthsGraph.forEach(({ code }) => {
    const montantInvests = calculInvestByMonth(dataTransacInvest, code);
    montantInvestByMonth.push(formatData(montantInvests));
  });

  const dataGraph = monthsGraph.map((monthData, index) => ({
    month: monthData.month,
    year: monthData.year,
    amount: montantInvestByMonth[index],
  }));

  const defaultConfig = {
    amount: {
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

  const chevronGraphIsVisible = lastMonthGraph.code < currentYearMonth;

  const theMonthGraph = `${firstMonthGraph.month} ${firstMonthGraph.year} - ${lastMonthGraph.month} ${lastMonthGraph.year}`;

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

  const simplifiedData = data.flatMap((investment) =>
    investment.transaction.map((trans) => ({
      name: investment.name,
      type: investment.type,
      amount: parseFloat(trans.amount) || 0,
      date: trans.date,
    }))
  );

  const lastTransactions = simplifiedData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const maxValue = Math.max(...dataGraph.map((item) => Math.max(item.amount)));

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Board investissement"
          typeProps="investment"
          btnAdd
          isFetching={isFetching}
        />
        <div className="flex flex-col w-full justify-center gap-4 animate-fade">
          <div className=" flex gap-4">
            <BoxInfos
              title="Investissements en cours"
              value={addSpace(formatAmount(amountBuy))}
              icon={<Pickaxe size={15} color="grey" />}
              onClick={() => navigate("inprogress")}
              isAmount
            />
            <BoxInfos
              title="Tous les investissements"
              value={addSpace(formatAmount(amountResult))}
              icon={<HandCoins size={15} color="grey" />}
              onClick={() => navigate("all")}
              isAmount
            />
            <BoxInfos
              title="Investissements vendus"
              value={addSpace(formatAmount(amountSale))}
              icon={<Shield size={15} color="grey" />}
              onClick={() => navigate("sold")}
              isAmount
            />
            <BoxInfos
              title="Mes ordres"
              value={data.length}
              icon={<BookA size={15} color="grey" />}
              onClick={() => navigate("order")}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-2/5 bg-primary-foreground rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-xl font-extralight italic">
                Dernières opérations
              </h2>
              <table className="h-full">
                <tbody className="w-full h-full flex flex-col">
                  {lastTransactions.map((operation, index) => (
                    <tr
                      key={index}
                      className="justify-between rounded-lg h-full flex flex-row items-center text-xs"
                    >
                      <td className="flex flex-row space-x-4 w-full">
                        <span>{format(new Date(operation.date), "dd/MM")}</span>
                        <span className="truncate">{operation.name}</span>
                      </td>
                      <td className="flex items-center flex-row w-full">
                        <td className="w-full text-right italic">
                          <b>{addSpace(operation.amount.toFixed(2))} €</b>
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
              <h2 className="text-xl font-extralight italic">Position</h2>

              {!isFetching ? (
                <RadialChart
                  chartData={chartDataByType}
                  chartConfig={chartConfigByType}
                  total={amountBuy.toFixed(2)}
                  inner={40}
                  outer={55}
                  height={140}
                  legend={renderCustomLegend}
                />
              ) : (
                <LoaderDots />
              )}
              {!isFetching ? (
                <RadialChart
                  chartData={chartDataByName}
                  chartConfig={chartConfigByName}
                  total={amountBuy.toFixed(2)}
                  inner={40}
                  outer={55}
                  height={140}
                  legend={renderCustomLegend}
                />
              ) : (
                <LoaderDots />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

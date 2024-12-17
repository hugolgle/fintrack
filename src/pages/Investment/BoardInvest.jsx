import { useQuery } from "@tanstack/react-query";
import { fetchInvestments } from "../../Service/Investment.service.jsx";
import Header from "../../composant/Header.jsx";
import { toast } from "sonner";
import Loader from "../../composant/Loader/Loader";
import { ROUTES } from "../../composant/Routes.jsx";
import { HttpStatusCode } from "axios";
import { Pickaxe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HandCoins } from "lucide-react";
import { formatEuro } from "../../utils/fonctionnel";
import { BookA } from "lucide-react";
import BoxInfos from "../../composant/Box/BoxInfos";
import { RadialChart } from "../../composant/Charts/RadialChart.jsx";
import { useNavigate } from "react-router";
import { useState } from "react";
import { renderCustomLegend } from "../../composant/Legend.jsx";
import LoaderDots from "../../composant/Loader/LoaderDots";
import { currentDate, getLastMonths } from "../../utils/other.js";
import { format } from "date-fns";
import { ChartLine } from "../../composant/Charts/ChartLine.jsx";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { calculInvestByMonth } from "../../utils/calcul.js";

export default function BoardInvest() {
  const navigate = useNavigate();
  const [selectNbMonth, setSelectNbMonth] = useState(6);
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

  const monthsGraph = getLastMonths(graphMonth, selectNbMonth);

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

  const simplifiedData = data.flatMap((item) =>
    item.transaction.map((trans) => ({
      name: item.name,
      type: item.type,
      amount: parseFloat(trans.amount) || 0,
      date: trans.date,
    }))
  );

  const maxValue = Math.max(...dataGraph.map((item) => Math.max(item.amount)));

  return (
    <section className="w-full">
      <div className="flex flex-col">
        <Header
          title="Investissement"
          typeProps="investment"
          btnAdd={ROUTES.ADD_ORDER}
          isFetching={isFetching}
        />
        <div className="flex flex-col w-full justify-center gap-4 animate-fade">
          <div className=" flex gap-4">
            <BoxInfos
              title="Investissements en cours"
              value={amountBuy}
              icon={<Pickaxe size={15} color="grey" />}
              onClick={() => navigate(ROUTES.INVESTMENT_IN_PROGRESS)}
              isAmount
            />
            <BoxInfos
              title="Tous les investissements"
              value={amountResult}
              icon={<HandCoins size={15} color="grey" />}
              onClick={() => navigate(ROUTES.INVESTMENT_ALL)}
              isAmount
            />
            <BoxInfos
              title="Investissements vendus"
              value={amountSale}
              icon={<Shield size={15} color="grey" />}
              onClick={() => navigate(ROUTES.INVESTMENT_SOLD)}
              isAmount
            />
            <BoxInfos
              title="Mes ordres"
              value={data.length}
              icon={<BookA size={15} color="grey" />}
              onClick={() => navigate(ROUTES.INVESTMENT_ORDER)}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-2/5 bg-primary-foreground h-fit ring-1 ring-border rounded-xl p-4 flex flex-col gap-4">
              <h2 className=" text-left">Dernières opérations</h2>
              <table className="h-full">
                <tbody className="w-full h-full gap-2 flex flex-col">
                  {simplifiedData
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 6)
                    .map((operation, index) => (
                      <tr
                        key={index}
                        className="justify-between rounded-lg h-full flex flex-row items-center text-xs"
                      >
                        <td className="flex flex-row space-x-4 w-4/5">
                          <span>
                            {format(new Date(operation.date), "dd/MM")}
                          </span>
                          <span className="truncate max-w-40">
                            {operation.name}
                          </span>
                        </td>

                        <p className="w-fit px-2 py-[1px] text-[10px] italic text-nowrap rounded-sm bg-blue-300 text-blue-900 dark:bg-blue-300 dark:text-blue-900">
                          {formatEuro.format(operation?.amount)}
                        </p>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="w-full relative flex flex-col h-fit justify-between bg-primary-foreground ring-1 ring-border rounded-xl p-4">
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
              <div
                className={`flex flex-row w-3/4 mx-auto px-20 items-center justify-between bottom-2`}
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
              <div className="absolute top-0 right-0 m-2">
                <Select
                  name="selectNbMonth"
                  value={selectNbMonth}
                  onValueChange={(value) => setSelectNbMonth(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nombre de mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={3}>3 mois</SelectItem>
                    <SelectItem value={6}>6 mois</SelectItem>
                    <SelectItem value={12}>12 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-2/4 bg-primary-foreground ring-1 ring-border rounded-xl p-4">
              <h2 className=" text-left">Position</h2>

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
              <Separator className="w-5/6 mx-auto" />
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

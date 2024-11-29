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
import { ChartLine } from "../../composant/Charts/ChartLine.jsx";
// import { ChartLineColor } from "../../composant/Charts/ChartLineColor.jsx";

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

  const [selectedByType, setSelectedByType] = useState(false);

  const handleByName = () => {
    setSelectedByType(false);
  };

  const handleByType = () => {
    setSelectedByType(true);
  };

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

  const chartData = [
    { month: "January", desktop: 186, mobile: 80, mac: 90 },
    { month: "February", desktop: 305, mobile: 200, mac: 20 },
    { month: "March", desktop: 237, mobile: 120, mac: 80 },
    { month: "April", desktop: 73, mobile: 190, mac: 20 },
    { month: "May", desktop: 209, mobile: 130, mac: 60 },
    { month: "June", desktop: 214, mobile: 140, mac: 200 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-3))",
    },
    mac: {
      label: "Mac",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  };

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
          <div className="h-32 flex gap-4">
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
            <div className="w-1/4 flex flex-col gap-4">
              <div className="flex gap-2 w-full">
                <Button
                  variant={!selectedByType ? "secondary" : "none"}
                  onClick={handleByName}
                  className="w-full"
                >
                  Par action
                </Button>

                <Button
                  variant={selectedByType ? "secondary" : "none"}
                  onClick={handleByType}
                  className="w-full"
                >
                  Par type
                </Button>
              </div>

              <div className="flex gap-4 rounded-xl bg-primary-foreground">
                {!isFetching ? (
                  <RadialChart
                    chartData={
                      selectedByType ? chartDataByType : chartDataByName
                    }
                    chartConfig={
                      selectedByType ? chartConfigByType : chartConfigByName
                    }
                    total={amountBuy.toFixed(2)}
                    inner={50}
                    outer={70}
                    height={200}
                    legend={renderCustomLegend}
                  />
                ) : (
                  <LoaderDots />
                )}
              </div>
            </div>
            <div className="w-2/4 p-4 flex flex-col gap-4 rounded-xl bg-primary-foreground">
              {/* <ChartLineColor /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

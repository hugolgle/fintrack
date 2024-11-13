import { useQuery } from "@tanstack/react-query";
import { fetchInvestments } from "../../../service/investment.service";
import Header from "../../../composant/header";
import { toast } from "sonner";
import Loader from "../../../composant/loader/loader";
import { useTheme } from "../../../context/ThemeContext";
import { HttpStatusCode } from "axios";
import { Pickaxe } from "lucide-react";
import { Shield } from "lucide-react";
import { HandCoins } from "lucide-react";
import { addSpace, formatAmount } from "../../../utils/fonctionnel";
import { BookA } from "lucide-react";
import BoxInfos from "../../../composant/boxInfos";
import { RadialChart } from "../../../composant/Charts/radialChart";

export default function BoardInvest() {
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

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

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

  const chartData = Object.values(categorySums).map((category, key) => {
    const pourcentage = (category.amount / totalAmountBuy) * 100;
    return {
      name: category.category,
      amount: category.amount,
      pourcentage: pourcentage,
      fill: `hsl(var(--chart-${key}))`,
    };
  });

  const chartConfig = Object.values(categorySums).reduce(
    (config, category, key) => {
      config[category.category] = {
        label: category.category,
        color: `hsl(var(--chart-${key}))`,
      };
      return config;
    },
    {}
  );

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
              onClick={() => navigate("/inprogress")}
              isAmount
            />
            <BoxInfos
              title="Tous les investissements"
              value={addSpace(formatAmount(amountResult))}
              icon={<HandCoins size={15} color="grey" />}
              onClick={() => navigate("/all")}
              isAmount
            />
            <BoxInfos
              title="Investissements vendus"
              value={addSpace(formatAmount(amountSale))}
              icon={<Shield size={15} color="grey" />}
              onClick={() => navigate("/sold")}
              isAmount
            />
            <BoxInfos
              title="Mes ordres"
              value={data.length}
              icon={<BookA size={15} color="grey" />}
              onClick={() => navigate("/order")}
            />
          </div>
          <div className="flex gap-4">
            <RadialChart
              chartData={chartData}
              chartConfig={chartConfig}
              total={amountBuy.toFixed(2)}
              inner={70}
              outer={90}
              height={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

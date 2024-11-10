import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInvestments } from "../../../service/investment.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "../../../composant/header";
import { toast } from "sonner";
import Loader from "../../../composant/loader/loader";
import { useTheme } from "../../../context/ThemeContext";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";
import { Pickaxe } from "lucide-react";
import { Shield } from "lucide-react";
import { HandCoins } from "lucide-react";
import { addSpace, formatAmount } from "../../../utils/fonctionnel";
import { BookA } from "lucide-react";
import BoxInfos from "../../../composant/boxInfos";

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
          <div className="flex gap-4"></div>
        </div>
      </div>
    </section>
  );
}

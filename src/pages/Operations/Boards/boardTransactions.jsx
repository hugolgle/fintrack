import { useNavigate } from "react-router-dom";
import {
  calculTotal,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../../utils/calcul";
import { addSpace, formatAmount } from "../../../utils/fonctionnel";
import { getLastSubscribe, getLastOperations } from "../../../utils/operations";
import { currentDate } from "../../../utils/other";
import { fetchTransactions } from "../../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import Header from "../../../composant/header";
import Loader from "../../../composant/loader/loader";
import { HttpStatusCode } from "axios";
import { DollarSign, Calendar, PieChart, TrendingUp } from "lucide-react";
import BoxInfos from "../../../composant/boxInfos";

export default function BoardTransactions({ type }) {
  const navigate = useNavigate();
  const { isLoading, data, isFetching, refetch } = useQuery({
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

  const { day, month, year } = currentDate();
  const currentYearMonth = `${year}${month}`;

  let lastYear = year;
  let lastMonth = month - 1;

  if (lastMonth === 0) {
    lastMonth = 12;
    lastYear -= 1;
  }

  lastMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth;

  const lastMonthYear = `${lastYear}${lastMonth}`;

  return (
    <>
      <section className="w-full">
        <div className="flex flex-col">
          <Header
            title={type === "Expense" ? "Board dépenses" : "Board revenus"}
            typeProps={type.toLowerCase()}
            btnAdd
            isFetching={isFetching}
          />

          <div className="flex flex-col gap-4 animate-fade">
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
                value={calculTotalByMonth(data, type, currentYearMonth)}
                valueLast={calculTotalByMonth(data, type, lastMonthYear)}
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
                value={calculTotalByYear(data, type, year)}
                valueLast={calculTotalByYear(data, type, year - 1)}
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
                value={calculTotal(data, type)}
                icon={<DollarSign size={15} color="grey" />}
                isAmount
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import {
  calculTotal,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../../utils/calcul";
import { addSpace, formatAmount } from "../../../utils/fonctionnel";
import { getLastSubscribe, getLastOperations } from "../../../utils/operations";
import { currentDate, getLastMonths, getLastYears } from "../../../utils/other";
import { fetchTransactions } from "../../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import Header from "../../../composant/header";
import Loader from "../../../composant/loader/loader";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";
import { DollarSign, Calendar, PieChart, TrendingUp } from "lucide-react";
import BoxInfos from "../../../composant/boxInfos";

export default function BoardTransactions({ type }) {
  const navigate = useNavigate();
  const { isLoading, data, isFetching } = useQuery({
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
    lastMonth = 12; // Décembre
    lastYear -= 1; // L'année précédente
  }

  // Ajouter un zéro devant le mois si nécessaire pour avoir le format `MM`
  lastMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth;

  const lastMonthYear = `${lastYear}${lastMonth}`;

  // const mySubscribes = getLastSubscribe(data);

  // const sortMySubscribes = mySubscribes.sort((a, b) => {
  //   const dateA = new Date(a.date);
  //   const dateB = new Date(b.date);

  //   return dateB.getTime() - dateA.getTime();
  // });

  // const lastSubscribeTotal = sortMySubscribes.reduce((total, subscription) => {
  //   return total + parseFloat(subscription.amount);
  // }, 0);

  // const { theme } = useTheme();
  // const bgColor =
  //   theme === "custom"
  //     ? "bg-colorPrimaryCustom"
  //     : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";
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
                onClick={() => navigate(`/expense/${currentYearMonth}`)}
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
              {/* <BoxInfos
                title="Dépenses depuis 2023"
                value={30000}
                icon={<TrendingUp size={15} color="grey"/>}
              /> */}
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

            {/* <div
              className={`flex flex-col w-[350px] items-center h-fit justify-center ${bgColor} rounded-2xl p-4`}
            >
              <p className="text-xl mx-8 font-thin italic mb-4">
                Mes abonnements
              </p>
              <table className="w-full h-full">
                <tbody className="w-full h-full flex flex-col gap-3">
                  {sortMySubscribes.map((subscribe) => (
                    <tr
                      key={subscribe._id}
                      className="w-full flex flex-row text-sm justify-between items-center"
                    >
                      <td className="flex flex-row space-x-4 w-full">
                        <span>{format(subscribe.date, "dd/MM")}</span>
                        <span className="truncate">{subscribe.title}</span>
                      </td>
                      <td className="w-full italic text-right">
                        <b>{formatAmount(subscribe.amount)} €</b>
                      </td>
                    </tr>
                  ))}
                  <Separator orientation="horizontal" />

                  <p className="text-xl mx-8 font-thin italic">
                    Total : <b>{formatAmount(lastSubscribeTotal)} €</b>
                  </p>
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

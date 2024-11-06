import { Link } from "react-router-dom";
import {
  calculTotal,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../../utils/calcul";
import { addSpace, formatAmount } from "../../../utils/fonctionnel";
import {
  getLastSubscribe,
  getLastTransactionsByType,
} from "../../../utils/operations";
import { currentDate, getLastMonths, getLastYears } from "../../../utils/other";
import { fetchTransactions } from "../../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import Header from "../../../composant/header";
import Loader from "../../../composant/loader/loader";
import { useTheme } from "../../../context/ThemeContext";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";

export default function BoardDepense() {
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

  const { month: currentMonth, year: currentYear } = currentDate();
  const currentYearMonth = `${currentYear}${currentMonth}`;

  const lastMonths = getLastMonths(currentYearMonth, 3).reverse();
  const lastYears = getLastYears(2);
  const lastTransactions = getLastTransactionsByType(data, "Expense", 5, true);

  const mySubscribes = getLastSubscribe(data);

  const sortMySubscribes = mySubscribes.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB.getTime() - dateA.getTime();
  });

  const lastSubscribeTotal = sortMySubscribes.reduce((total, subscription) => {
    return total + parseFloat(subscription.amount);
  }, 0);

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  return (
    <>
      <section className="w-full">
        <div className="flex flex-col">
          <Header
            title="Board dépense"
            typeProps="expense"
            btnAdd
            isFetching={isFetching}
          />
          <div className="flex gap-4 animate-fade">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex w-full gap-4">
                {/* Mois en cours à gauche */}
                <Link
                  key={lastMonths[0].code}
                  to={lastMonths[0].code}
                  className={`flex flex-col hover:scale-95 justify-between w-3/5 ${bgColor} rounded-2xl hover:bg-opacity-80 transition-all p-4 gap-4 cursor-pointer`}
                >
                  <div className="flex flex-col w-full gap-4">
                    <p className="text-3xl font-thin">
                      {calculTotalByMonth(
                        data,
                        "Expense",
                        lastMonths[0].code,
                        null,
                        null
                      )}
                    </p>

                    {lastTransactions && lastTransactions.length > 0 ? (
                      <table>
                        <tbody>
                          {lastTransactions.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>{format(transaction.date, "dd/MM")}</td>
                              <td>{transaction.title}</td>
                              <td>{transaction.category}</td>
                              <td>
                                <b>{addSpace(transaction.amount)} €</b>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="italic">Aucune dépense ce mois-ci !</p>
                    )}
                  </div>
                  <p className="text-right italic">Ce mois-ci</p>
                </Link>
                <div className="flex flex-col w-2/5 gap-4 text-left">
                  {lastMonths.slice(1).map((month) => (
                    <Link
                      key={month.code}
                      to={month.code}
                      className={`flex flex-col hover:scale-95 justify-between w-full h-full ${bgColor} rounded-2xl hover:bg-opacity-80 transition-all p-4 gap-4 cursor-pointer`}
                    >
                      <p className="text-right italic">{month.month}</p>
                      <p className="text-3xl font-thin">
                        {calculTotalByMonth(
                          data,
                          "Expense",
                          month.code,
                          null,
                          null
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-row gap-4 w-full ">
                {lastYears.map((year) => (
                  <Link
                    key={year}
                    to={`${year}`}
                    className={`w-1/2 relative flex flex-col items-center justify-center h-32 ${bgColor} rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2`}
                  >
                    <p className="italic absolute top-2">{year}</p>
                    <p className="text-3xl font-thin">
                      {calculTotalByYear(
                        data,
                        "Expense",
                        `${year}`,
                        null,
                        null
                      )}
                    </p>
                  </Link>
                ))}
              </div>

              <Link
                to="all"
                className={`w-full relative flex flex-col items-center justify-center h-32 ${bgColor} rounded-2xl hover:bg-opacity-80 hover:scale-95  transition-all p-2`}
              >
                <p className="italic absolute top-2">Toutes les dépenses</p>
                <p className="text-3xl font-thin">
                  {calculTotal(data, "Expense", null, null)}
                </p>
              </Link>
            </div>
            <Separator orientation="vertical" className="h-80 my-auto" />
            <div
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

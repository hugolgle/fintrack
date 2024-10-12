import { Link } from "react-router-dom";
import {
  calculTotal,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../../utils/calcul";
import { addSpace, convertirFormatDate } from "../../../utils/fonctionnel";
import {
  getCurrentMonth,
  getLastTransactionsByType,
} from "../../../utils/operations";
import {
  getLastThreeMonthsOfCurrentYear,
  getLastTwoYears,
  premierJourMoisEnCours,
} from "../../../utils/other";
import { fetchTransactions } from "../../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import Header from "../../../composant/header";
import Loader from "../../../composant/loader";

export default function BoardRecette() {
  const userId = localStorage.getItem("userId");
  const { isLoading, data } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions(userId);

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }

      return response.data;
    },
  });

  // Affichez un écran de chargement pendant que vous vérifiez l'authentification
  if (isLoading) {
    return <Loader />;
  }

  const lastMonths = getLastThreeMonthsOfCurrentYear();
  const lastYears = getLastTwoYears();
  const currentMonth = getCurrentMonth();
  const lastTransactions = getLastTransactionsByType(data, "Revenue", 5, true);
  const firstDayMonth = premierJourMoisEnCours();

  return (
    <>
      <section className="w-full">
        <div className="flex flex-col">
          <Header title="Board recette" typeProps="revenue" btnAdd />
          <div className="flex flex-col gap-4 w-full animate-fade">
            <div className="flex flex-row w-full h-64 gap-4">
              <Link
                to={currentMonth}
                className="flex flex-col hover:scale-95 justify-between w-3/5 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 transition-all p-4 gap-4 cursor-pointer"
              >
                <div className="flex flex-col w-full gap-4">
                  <p className="text-4xl font-thin">
                    {calculTotalByMonth(
                      data,
                      "Revenue",
                      currentMonth,
                      null,
                      null
                    )}
                  </p>

                  {lastTransactions && lastTransactions.length > 0 ? (
                    <table>
                      <tbody>
                        {lastTransactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>{convertirFormatDate(transaction.date)}</td>
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
                    <p className="italic">Aucune recette ce mois-ci !</p>
                  )}
                </div>

                <p className="text-right italic">Depuis le {firstDayMonth}</p>
              </Link>
              <div className="flex flex-col-reverse gap-4 w-2/5 text-left">
                {lastMonths.map((month) => (
                  <Link
                    key={month.code}
                    to={month.code}
                    className="flex flex-col-reverse hover:scale-95 justify-between w-full h-full bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 transition-all p-4 gap-4 cursor-pointer"
                  >
                    <p className="text-right italic">{month.month}</p>
                    <p className="text-4xl font-thin">
                      {calculTotalByMonth(
                        data,
                        "Revenue",
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
                  className=" w-1/2 relative flex flex-col items-center justify-center h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
                >
                  <p className="italic absolute top-2">{year}</p>
                  <p className="text-4xl font-thin">
                    {calculTotalByYear(data, "Revenue", `${year}`, null, null)}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              to="all"
              className="w-full relative flex flex-col items-center justify-center h-32 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95  transition-all p-2"
            >
              <p className="italic absolute top-2">Toutes les recettes</p>
              <p className="text-4xl font-thin">
                {calculTotal(data, "Revenue", null, null)}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

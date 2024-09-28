import { Link } from "react-router-dom";
import {
  calculTotal,
  calculTotalByMonth,
  calculTotalByYear,
} from "../../../utils/calcul";
import {
  addSpace,
  convertirFormatDate,
  getCurrentYearAndMonth,
  separateMillier,
} from "../../../utils/fonctionnel";
import {
  getCurrentMonth,
  getLastSubscribe,
  getLastTransactionsByType,
} from "../../../utils/operations";
import {
  getLastThreeMonthsOfCurrentYear,
  getLastTwoYears,
  premierJourMoisEnCours,
} from "../../../utils/other";
import BtnAdd from "../../../components/Button/btnAdd";
import Title from "../../../components/Text/title";

export default function BoardDepense() {
  const lastMonths = getLastThreeMonthsOfCurrentYear();
  const lastYears = getLastTwoYears();
  const currentMonth = getCurrentMonth();
  const lastTransactions = getLastTransactionsByType("Dépense", 5, true);
  const firstDayMonth = premierJourMoisEnCours();

  const mySubscribes = getLastSubscribe();

  const sortMySubscribes = mySubscribes.sort((a: any, b: any) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB.getTime() - dateA.getTime();
  });

  const lastSubscribeTotal = sortMySubscribes.reduce(
    (total: number, subscription: any) => {
      return total + parseFloat(subscription.montant);
    },
    0,
  );

  const currentMonthYear = getCurrentYearAndMonth();

  return (
    <>
      <section className="h-full w-full">
        <div className="flex flex-col">
          <div className="w-full relative">
            <Title title="Dépenses" />
            <div className="absolute top-0 left-0">
              <BtnAdd />
            </div>
          </div>
          <div className="flex gap-4 animate-fade">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row w-full h-64 gap-4">
                <Link
                  to={currentMonth}
                  className="flex flex-col hover:scale-95 justify-between w-3/5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-opacity-80 transition-all p-4 gap-4 cursor-pointer"
                >
                  <div className="flex flex-col w-full gap-4">
                    <p className="text-4xl font-thin">
                      {calculTotalByMonth("Dépense", currentMonth, null, null)}
                    </p>

                    {lastTransactions && lastTransactions.length > 0 ? (
                      <table>
                        <tbody>
                          {lastTransactions.map((transaction: any) => (
                            <tr key={transaction._id}>
                              <td>{convertirFormatDate(transaction.date)}</td>
                              <td>{transaction.titre}</td>
                              <td>{transaction.categorie}</td>
                              <td>
                                <b>{addSpace(transaction.montant)} €</b>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="italic">Aucune dépense ce mois-ci !</p>
                    )}
                  </div>

                  <p className="text-right italic">Depuis le {firstDayMonth}</p>
                </Link>
                <div className="flex flex-col-reverse gap-4 w-2/5 text-left">
                  {lastMonths.map((month: any) => (
                    <Link
                      key={month.code}
                      to={month.code}
                      className="flex flex-col-reverse hover:scale-95 justify-between w-full h-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-opacity-80 transition-all p-4 gap-4 cursor-pointer"
                    >
                      <p className="text-right italic">{month.month}</p>
                      <p className="text-4xl font-thin">
                        {calculTotalByMonth("Dépense", month.code, null, null)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-row gap-4 w-full ">
                {lastYears.map((year: any) => (
                  <Link
                    key={year}
                    to={`${year}`}
                    className=" w-1/2 relative flex flex-col items-center justify-center h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
                  >
                    <p className="italic absolute top-2">{year}</p>
                    <p className="text-4xl font-thin">
                      {calculTotalByYear("Dépense", `${year}`, null, null)}
                    </p>
                  </Link>
                ))}
              </div>

              <Link
                to="all"
                className="w-full relative flex flex-col items-center justify-center h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-opacity-80 hover:scale-95  transition-all p-2"
              >
                <p className="italic absolute top-2">Toutes les dépenses</p>
                <p className="text-4xl font-thin">
                  {calculTotal("Dépense", null, null)}
                </p>
              </Link>
            </div>
            <Link
              to={`${currentMonthYear}?categories=Abonnement`}
              className="flex flex-col w-[500px] items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-opacity-80 hover:scale-95  transition-all p-4"
            >
              <p className="text-xl mx-8 font-thin italic mb-4">
                Mes abonnements
              </p>
              <table className="w-full h-full">
                <tbody className="w-full h-full flex flex-col gap-3">
                  {sortMySubscribes.map((subscribe: any) => (
                    <tr
                      key={subscribe._id}
                      className="w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-xl flex flex-row items-center py-1 text-sm "
                    >
                      <td className="w-full">
                        {convertirFormatDate(subscribe.date)}
                      </td>
                      <td className="w-full truncate">{subscribe.titre}</td>
                      <td className="w-full">
                        <b>{separateMillier(subscribe.montant)} €</b>
                      </td>
                    </tr>
                  ))}
                  <p className="text-xl mx-8 font-thin italic">
                    Total : <b>{separateMillier(lastSubscribeTotal)} €</b>
                  </p>
                </tbody>
              </table>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

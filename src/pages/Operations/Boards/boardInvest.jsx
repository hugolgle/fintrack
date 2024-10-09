import { Link } from "react-router-dom";
import BtnAdd from "../../../composant/Button/btnAdd";
import { getAllInvestments } from "../../../utils/operations";
import {
  calculTotalInvestment,
  calculTotalInvestmentByTitle,
} from "../../../utils/calcul";
import { formatDateBis } from "../../../utils/fonctionnel";
import MainLayout from "../../../layout/mainLayout";
import Header from "../../../composant/header";

export default function BoardInvest() {
  const getInvest = getAllInvestments(null);

  const firstDateByTitle = getInvest.reduce((acc, investment) => {
    const { titre, date } = investment;
    if (!acc[titre] || new Date(date) < new Date(acc[titre])) {
      acc[titre] = date;
    }
    return acc;
  }, {});

  const uniqueInvest = getInvest.filter((investment) => {
    return (
      new Date(investment.date).getTime() ===
      new Date(firstDateByTitle[investment.titre]).getTime()
    );
  });

  const investmentCountByTitle = getInvest.reduce((acc, investment) => {
    const { titre } = investment;
    acc[titre] = (acc[titre] || 0) + 1;
    return acc;
  }, {});

  const montantInvestInProgress = calculTotalInvestment(false, "");
  const montantInvestSold = calculTotalInvestment(true, "");
  const montantInvest = calculTotalInvestment(null, "");

  // Function to determine the hover color class based on investment type
  const getHoverClass = (type) => {
    switch (type) {
      case "Action":
        return "bg-pink-600"; // Couleur pour Action
      case "ETF":
        return "bg-blue-600"; // Couleur pour ETF
      case "Crypto":
        return "bg-green-600"; // Couleur pour Crypto
      case "Obligation":
        return "bg-purple-600"; // Couleur pour Obligation
      case "Dérivé":
        return "bg-red-600"; // Couleur pour Dérivé
      default:
        return "bg-gray-600"; // Couleur par défaut
    }
  };

  return (
    <>
      <section>
        <Header title="Board investissement" typeProps="invest" btnAdd />
        <div className="flex flex-col w-full justify-center gap-4 animate-fade">
          <div className="h-32 flex gap-4 ">
            <Link
              to="inprogress"
              className="w-full relative flex flex-col items-center justify-center h-full bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
            >
              <p className="italic font-thin absolute top-2">
                Investissements en cours
              </p>
              <p className="text-4xl font-thin">{montantInvestInProgress}</p>
            </Link>
            <Link
              to="all"
              className="w-full relative flex flex-col items-center justify-center h-full bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
            >
              <p className="italic font-thin absolute top-2">
                Tous les investissements
              </p>
              <p className="text-4xl font-thin">{montantInvest}</p>
            </Link>
            <Link
              to="sold"
              className="w-full relative flex flex-col items-center justify-center h-full bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl hover:bg-opacity-80 hover:scale-95 transition-all p-2"
            >
              <p className="italic font-thin absolute top-2">
                Investissements vendus
              </p>
              <p className="text-4xl font-thin">{montantInvestSold}</p>
            </Link>
          </div>

          <div className="flex items-center justify-center mb-1 px-8">
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>{" "}
            <p className="text-xl mx-8 font-thin italic">Mes ordres</p>
            <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>{" "}
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {uniqueInvest.map(({ titre, type, date }, index) => {
              const linkInvest = titre.toLowerCase().replace(/\s+/g, "");
              const montant = calculTotalInvestmentByTitle(null, titre);

              const count = investmentCountByTitle[titre];

              return (
                <Link
                  key={index}
                  to={linkInvest}
                  className={`w-60 h-40 flex flex-col gap-4 justify-between font-thin rounded-2xl px-4 py-4 transition-all hover:scale-95 bg-opacity-20 hover:bg-opacity-50 ${getHoverClass(
                    type
                  )} `}
                >
                  <div className="flex justify-between">
                    <p className="text-right text-sm text-gray-700 dark:text-gray-300 italic">
                      {formatDateBis(date)}
                    </p>
                    <p className="text-right text-sm text-gray-700 dark:text-gray-300 italic">
                      {type}
                    </p>
                  </div>

                  <p className="text-xl truncate">{titre}</p>
                  <div className="flex justify-between">
                    <p className="font-medium italic">{montant}</p>
                    <p className="text-lg italic">({count})</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

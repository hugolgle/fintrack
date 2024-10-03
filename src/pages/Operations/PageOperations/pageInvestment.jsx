import {
  getAllInvestments,
  getInvestmentsByTitle,
} from "../../../utils/operations";
import TableauInvest from "../../../composant/Table/tableInvest";
import {
  calculTotalInvestment,
  calculTotalInvestmentByTitle,
} from "../../../utils/calcul";
import { useParams } from "react-router-dom";
import LayoutOperation from "../../../layout/layoutOperation";

export default function PageInvestment() {
  const { urlInvest } = useParams();
  const investmentTitle = urlInvest || "Investissement inconnu"; // Valeur par défaut

  // Déterminer les investissements à afficher
  const investissement =
    urlInvest === "all"
      ? getAllInvestments(null)
      : urlInvest === "sold"
        ? getAllInvestments(true)
        : urlInvest === "inprogress"
          ? getAllInvestments(false)
          : getInvestmentsByTitle(investmentTitle);

  // Calculer le total en fonction de l'état des investissements
  const totalInvestissement =
    urlInvest === "all"
      ? calculTotalInvestment(null, "")
      : urlInvest === "sold"
        ? calculTotalInvestment(true, "")
        : urlInvest === "inprogress"
          ? calculTotalInvestment(false, "")
          : calculTotalInvestmentByTitle(null, investmentTitle);

  // Calculer le nombre de transactions
  const nombreTransactions =
    urlInvest === "all"
      ? getAllInvestments(null).length
      : urlInvest === "sold"
        ? getAllInvestments(true).length
        : urlInvest === "inprogress"
          ? getAllInvestments(false).length
          : getInvestmentsByTitle(investmentTitle).length;

  return (
    <>
      <section className="w-full relative">
        <LayoutOperation
          title={`Investissements
          ${
            urlInvest === "sold"
              ? "vendus"
              : urlInvest === "inprogress"
                ? "en cours"
                : ""
          }`}
          typeProps={"invest"}
          pageTable
        />

        <TableauInvest investments={investissement} />
        <div className="fixed w-44 bottom-10 right-0 rounded-l-xl shadow-2xl shadow-black bg-zinc-200 hover:opacity-0 dark:bg-zinc-800 py-3 transition-all">
          Total : <b>{totalInvestissement}</b>
          <br />
          Transaction(s) : <b>{nombreTransactions}</b>
        </div>
      </section>
    </>
  );
}

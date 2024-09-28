import {
  getAllInvestments,
  getInvestmentsByTitle,
} from "../../../utils/operations";
import TableauInvest from "../../../components/Table/tableInvest";
import {
  calculTotalInvestment,
  calculTotalInvestmentByTitle,
} from "../../../utils/calcul";
import BtnReturn from "../../../components/Button/btnReturn";
import BtnAdd from "../../../components/Button/btnAdd";
import { useParams } from "react-router-dom";
import Title from "../../../components/Text/title";

export default function PageInvestment() {
  const { urlInvest } = useParams<{ urlInvest: string }>();
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
        <Title
          title={`Investissements
          ${
            urlInvest === "sold"
              ? "vendus"
              : urlInvest === "inprogress"
                ? "en cours"
                : ""
          }`}
        />

        <div className="absolute top-0 flex flex-row w-full gap-2">
          <BtnReturn />
          <BtnAdd to="/invest" />
        </div>

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

import { getLastTransactionsByType } from "../../utils/operations";
import {
  calculEconomie,
  calculInvestByMonth,
  calculTotalByMonth,
} from "../../utils/calcul";
import {
  addSpace,
  convertDate,
  convertirFormatDate,
} from "../../utils/fonctionnel";
import { CamembertTdb } from "../../composant/Charts/camembertTdb";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { GraphiqueTdb } from "../../composant/Charts/graphiqueTdb";
import { categorieDepense } from "../../../public/categories.json";
import { getLastSixMonths } from "../../utils/other";
import BoxTdb from "../../composant/Box/boxDB";
import Title from "../../composant/Text/title";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TableauDeBord() {
  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    return { month: currentMonth, year: currentYear };
  };

  const { month: currentMonth, year: currentYear } = getCurrentMonthAndYear();

  const newCurrentMonth = String(currentMonth).padStart(2, "0");
  const currentDate = `${currentYear}${newCurrentMonth}`;

  const montantRecettesMonth = calculTotalByMonth(
    "Recette",
    currentDate,
    null,
    null
  );
  const montantDepensesMonth = calculTotalByMonth(
    "Dépense",
    currentDate,
    null,
    null
  );

  const InvestCurrentMonth = calculInvestByMonth(currentDate);

  const getPreviousMonthAndYear = (month, year) => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    return { month: prevMonth, year: prevYear };
  };

  const { month: previousMonth, year: previousYear } = getPreviousMonthAndYear(
    currentMonth,
    currentYear
  );

  const newPreviousMonth = String(previousMonth).padStart(2, "0");
  const previousDate = `${previousYear}${newPreviousMonth}`;

  const montantRecettesLastMonth = calculTotalByMonth(
    "Recette",
    previousDate,
    null,
    null
  );
  const montantDepensesLastMonth = calculTotalByMonth(
    "Dépense",
    previousDate,
    null,
    null
  );

  const economiesCurrentMonth = calculEconomie(
    `${currentYear}`,
    newCurrentMonth
  );

  const investLastMonth = calculInvestByMonth(previousDate);

  const economieLastMonth = calculEconomie(`${previousYear}`, newPreviousMonth);

  const lastTransactions = getLastTransactionsByType(null, 6, false);

  const formatData = (data) => {
    const cleanedData = data.replace(/[^\d.-]/g, "").replace(/ /g, "");
    const absoluteValue = Math.abs(parseFloat(cleanedData));

    return absoluteValue.toFixed(2);
  };

  const [month, setMonth] = useState(currentDate);

  const clickLastMonth = () => {
    let yearNum = parseInt(month.slice(0, 4), 10);
    let monthNum = parseInt(month.slice(4), 10);
    monthNum -= 1;
    if (monthNum === 0) {
      monthNum = 12;
      yearNum -= 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setMonth(newDate);
  };

  const clickNextMonth = () => {
    let yearNum = parseInt(month.slice(0, 4), 10);
    let monthNum = parseInt(month.slice(4), 10);

    monthNum += 1;

    if (monthNum === 13) {
      monthNum = 1;
      yearNum += 1;
    }

    const newMonth = monthNum.toString().padStart(2, "0");

    const newDate = `${yearNum}${newMonth}`;
    setMonth(newDate);
  };

  const categoriesDf = categorieDepense.map((categorie) => {
    if (categorie.categorie === "Fixe") {
      return categorie.name;
    }
  });

  const categoriesLoisir = categorieDepense.map((categorie) => {
    if (categorie.categorie === "Loisir") {
      return categorie.name;
    }
  });

  const dataDf = calculTotalByMonth("Dépense", month, categoriesDf, null);
  const dataLoisir = calculTotalByMonth(
    "Dépense",
    month,
    categoriesLoisir,
    null
  );

  const total = calculTotalByMonth("Recette", month, null, null);

  const montantInvest = calculInvestByMonth(month);

  const [graphMonth, setGraphMonth] = useState(currentDate);

  const clickNextMonthGraph = () => {
    let yearNum = parseInt(graphMonth.slice(0, 4), 10);
    let monthNum = parseInt(graphMonth.slice(4), 10);
    monthNum += 1;
    if (monthNum === 13) {
      monthNum = 1;
      yearNum += 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setGraphMonth(newDate);
  };

  const clickLastMonthGraph = () => {
    let yearNum = parseInt(graphMonth.slice(0, 4), 10);
    let monthNum = parseInt(graphMonth.slice(4), 10);
    monthNum -= 1;
    if (monthNum === 0) {
      monthNum = 12;
      yearNum -= 1;
    }
    const newMonth = monthNum.toString().padStart(2, "0");
    const newDate = `${yearNum}${newMonth}`;
    setGraphMonth(newDate);
  };

  // Obtenir les 6 derniers mois et leurs montants
  const lastSixMonths = getLastSixMonths(graphMonth);

  const montantDepenseByMonth = [];
  const montantRecetteByMonth = [];
  const montantInvestByMonth = [];

  lastSixMonths.forEach(({ code }) => {
    const montantDepenses = calculTotalByMonth("Dépense", code, null, null);
    const montantRecettes = calculTotalByMonth("Recette", code, null, null);
    const montantInvests = calculInvestByMonth(code);

    montantDepenseByMonth.push(formatData(montantDepenses));
    montantRecetteByMonth.push(formatData(montantRecettes));
    montantInvestByMonth.push(formatData(montantInvests));
  });

  // Préparer les données pour le graphique
  const dataGraph = lastSixMonths.map((monthData, index) => ({
    month: monthData.month,
    year: monthData.year,
    montantDepense: montantDepenseByMonth[index],
    montantRecette: montantRecetteByMonth[index],
    montantInvest: montantInvestByMonth[index],
  }));

  const firstMonth = lastSixMonths[0];

  const lastMonth = lastSixMonths[lastSixMonths.length - 1];

  return (
    <>
      <section className="w-full">
        <Title title="Tableau de bord" />

        <TooltipProvider>
          <div className="absolute flex gap-3 top-4 left-4">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to="/depense/add"
                  className="bg-colorDepense bg-opacity-15 px-2 py-1 opacity-50 rounded-xl hover:scale-95 hover:opacity-75 transition-all"
                >
                  <Plus />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <p>Ajouter une dépense</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to="/recette/add"
                  className="bg-colorRecette bg-opacity-15 px-2 py-1 opacity-50 rounded-xl hover:scale-95 hover:opacity-75 transition-all"
                >
                  <Plus />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <p>Ajouter une recette</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to="/invest/add"
                  className="bg-colorInvest bg-opacity-15 px-2 py-1 opacity-50 rounded-xl hover:scale-95 hover:opacity-75 transition-all"
                >
                  <Plus />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <p>Ajouter un investissement</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <div className="flex flex-col gap-4 animate-fade">
          <div className="flex flex-row gap-4 h-full">
            <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-3xl font-extralight italic">
                Dernières transactions
              </h2>
              <table className="h-full">
                <tbody className="w-full h-full flex flex-col gap-2">
                  {lastTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className={`bg-opacity-15 rounded h-full flex flex-row items-center py-1 text-sm ${transaction.type === "Recette" ? "bg-green-600" : transaction.type === "Dépense" ? "bg-red-600" : ""}`}
                    >
                      <td className="w-full">
                        {convertirFormatDate(transaction.date)}
                      </td>
                      <td className="w-full truncate">{transaction.titre}</td>
                      <td className="w-full">{transaction.categorie}</td>
                      <td className="w-full">
                        <b>{addSpace(transaction.montant)} €</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-2/3 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-4">
              <BoxTdb
                title="Mois actuel"
                montantDepense={montantDepensesMonth}
                montantRecette={montantRecettesMonth}
                montantEconomie={economiesCurrentMonth}
                montantInvest={InvestCurrentMonth}
              />
            </div>
            <div className="w-2/3 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-4">
              <BoxTdb
                title="Mois dernier"
                montantDepense={montantDepensesLastMonth}
                montantRecette={montantRecettesLastMonth}
                montantEconomie={economieLastMonth}
                montantInvest={investLastMonth}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4 h-full">
            <div className="w-7/12 bg-zinc-100 dark:bg-zinc-900 rounded-xl h-full p-4 relative">
              <h2 className="text-3xl font-extralight italic">Graphique</h2>
              <GraphiqueTdb data={dataGraph} />
              <div
                className={`flex flex-row gap-4 w-full px-20 justify-between bottom-2`}
              >
                <ChevronLeft
                  size={30}
                  className="hover:bg-zinc-200 hover:dark:bg-zinc-800 rounded-full p-2 cursor-pointer duration-300 transition-all"
                  onClick={clickLastMonthGraph}
                />
                <p className="text-sm italic">
                  {firstMonth.month} {firstMonth.year} - {lastMonth.month}{" "}
                  {lastMonth.year}
                </p>
                <ChevronRight
                  size={30}
                  className="hover:bg-zinc-200 hover:dark:bg-zinc-800 rounded-full p-2 cursor-pointer duration-300 transition-all"
                  onClick={clickNextMonthGraph}
                />
              </div>
            </div>
            <div className="w-5/12 bg-zinc-100  dark:bg-zinc-900 rounded-xl p-4">
              <h2 className="text-3xl font-extralight italic">Répartitions</h2>
              <div className="flex flex-row justify-between w-full py-3 px-16">
                <ChevronLeft
                  size={30}
                  onClick={clickLastMonth}
                  className="hover:bg-zinc-200 hover:dark:bg-zinc-800 rounded-full p-2 cursor-pointer duration-300 transition-all"
                />
                <p className="font-thin italic">{convertDate(month)}</p>
                <ChevronRight
                  size={30}
                  onClick={clickNextMonth}
                  className={`hover:bg-zinc-200 hover:dark:bg-zinc-800 rounded-full p-2 cursor-pointer duration-300 transition-all ${month >= currentDate ? "invisible" : ""}`}
                />
              </div>
              <CamembertTdb
                dataDf={formatData(dataDf)}
                dataLoisir={formatData(dataLoisir)}
                dataInvest={montantInvest}
                total={formatData(total)}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

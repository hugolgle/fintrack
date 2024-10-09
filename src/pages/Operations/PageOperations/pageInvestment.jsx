import { useState, useEffect } from "react";
import {
  getAllInvestments,
  getInvestmentsByTitle,
} from "../../../utils/operations";
import Tableau from "../../../composant/Table/tableau";
import {
  calculTotalInvestment,
  calculTotalInvestmentByTitle,
} from "../../../utils/calcul";
import Header from "../../../composant/header";
import { useParams } from "react-router-dom/dist/umd/react-router-dom.development";

export default function PageInvestment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectOpe, setSelectOpe] = useState(false);
  const [clickResearch, setClickResearch] = useState(false);

  const handleSelectOpe = () => {
    setSelectOpe(!selectOpe);
  };
  const { status } = useParams();
  const investmentTitle = status || "Investissement inconnu";

  let investissements;
  switch (status) {
    case "all":
      investissements = getAllInvestments(null);
      break;
    case "sold":
      investissements = getAllInvestments(true);
      break;
    case "inprogress":
      investissements = getAllInvestments(false);
      break;
    default:
      investissements = getInvestmentsByTitle(investmentTitle);
      break;
  }

  let totalInvestissement;
  switch (status) {
    case "all":
      totalInvestissement = calculTotalInvestment(null, "");
      break;
    case "sold":
      totalInvestissement = calculTotalInvestment(true, "");
      break;
    case "inprogress":
      totalInvestissement = calculTotalInvestment(false, "");
      break;
    default:
      totalInvestissement = calculTotalInvestmentByTitle(null, investmentTitle);
      break;
  }

  let nombreTransactions;
  switch (status) {
    case "all":
      nombreTransactions = getAllInvestments(null).length;
      break;
    case "sold":
      nombreTransactions = getAllInvestments(true).length;
      break;
    case "inprogress":
      nombreTransactions = getAllInvestments(false).length;
      break;
    default:
      nombreTransactions = getInvestmentsByTitle(investmentTitle).length;
      break;
  }

  const performSearch = (term) => {
    const filteredInvestments = investissements.filter((investment) => {
      const titleMatches = investment.titre
        .toLowerCase()
        .includes(term.toLowerCase());
      const typeMatches = investment.type
        .toLowerCase()
        .includes(term.toLowerCase());
      const montantMatches = investment.montant
        .toLowerCase()
        .includes(term.toLowerCase());
      const dateMatches = investment.date
        .toLowerCase()
        .includes(term.toLowerCase());
      return titleMatches || typeMatches || montantMatches || dateMatches;
    });
    setSearchResults(filteredInvestments);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(investissements);
    }
  }, [searchTerm, investissements]);

  const columns = [
    {
      id: 1,
      name: "ID",
    },
    {
      id: 3,
      name: "Type",
    },
    {
      id: 2,
      name: "Titre",
    },
    {
      id: 4,
      name: "Date",
    },
    ...(status === "all"
      ? [
          {
            id: 5,
            name: "Status",
          },
        ]
      : []),
    {
      id: status === "inprogress" ? 6 : 5,
      name: "Montant investi",
    },
    ...(status === "sold"
      ? [
          {
            id: 5,
            name: "Montant vendu",
          },
          {
            id: 5,
            name: "Bénéfice/Déficit",
          },
        ]
      : []),
  ];

  let statusType = "";

  switch (status) {
    case "sold":
      statusType = "vendus";
      break;
    case "inprogress":
      statusType = "en cours";
      break;
    default:
      statusType = "";
      break;
  }

  return (
    <>
      <section className="w-full relative">
        <Header
          title={`Investissements ${statusType}`}
          typeProps={"invest"}
          handleSelectOpe={handleSelectOpe}
          handleSearchChange={handleSearchChange}
          setClickResearch={setClickResearch}
          clickResearch={clickResearch}
          btnSearch
          btnReturn
          btnAdd
          btnFilter
          btnSelect
        />

        <Tableau
          data={searchTerm ? searchResults : investissements}
          columns={columns}
          type="investments"
          selectOpe={selectOpe}
        />

        <div className="fixed w-44 bottom-10 right-0 rounded-l-xl shadow-2xl shadow-black bg-colorPrimaryLight hover:opacity-0 dark:bg-zinc-900 py-3 transition-all">
          Total : <b>{totalInvestissement}</b>
          <br />
          Transaction(s) : <b>{nombreTransactions}</b>
        </div>
      </section>
    </>
  );
}

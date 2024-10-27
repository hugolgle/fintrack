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
import { useQuery } from "@tanstack/react-query";
import { fetchInvestments } from "../../../service/investment.service";
import Loader from "../../../composant/loader";

export default function PageInvestment() {
  const { status } = useParams();
  const investmentTitle = status || "Investissement inconnu";

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectOpe, setSelectOpe] = useState(false);
  const [clickResearch, setClickResearch] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();
      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }
      return response.data;
    },
    refetchOnMount: true,
  });

  let investissements = [];
  let totalInvestissement = 0;
  let nombreTransactions = 0;

  if (!isLoading && data) {
    switch (status) {
      case "all":
        investissements = data;
        totalInvestissement = calculTotalInvestment(data, null, "");
        nombreTransactions = data.length;
        break;
      case "sold":
        investissements = getAllInvestments(data, true);
        totalInvestissement = calculTotalInvestment(data, true, "");
        nombreTransactions = investissements.length;
        break;
      case "inprogress":
        investissements = getAllInvestments(data, false);
        totalInvestissement = calculTotalInvestment(data, false, "");
        nombreTransactions = investissements.length;
        break;
      default:
        investissements = getInvestmentsByTitle(data, investmentTitle);
        totalInvestissement = calculTotalInvestmentByTitle(
          data,
          null,
          investmentTitle
        );
        nombreTransactions = investissements.length;
        break;
    }
  }

  const handleSelectOpe = () => {
    setSelectOpe(!selectOpe);
  };

  const performSearch = (term) => {
    const filteredInvestments = investissements.filter((investment) => {
      const titleMatches = investment.title
        .toLowerCase()
        .includes(term.toLowerCase());
      const typeMatches = investment.type
        .toLowerCase()
        .includes(term.toLowerCase());
      const montantMatches = investment.amount
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
    { id: 1, name: "ID" },
    { id: 3, name: "Type" },
    { id: 2, name: "Titre" },
    { id: 4, name: "Date" },
    ...(status === "all" ? [{ id: 5, name: "Status" }] : []),
    { id: status === "inprogress" ? 6 : 5, name: "Montant investi" },
    ...(status === "sold"
      ? [
          { id: 5, name: "Montant vendu" },
          { id: 5, name: "Bénéfice/Déficit" },
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <section className="w-full relative">
        <Header
          title={`Investissements ${statusType}`}
          typeProps="investment"
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

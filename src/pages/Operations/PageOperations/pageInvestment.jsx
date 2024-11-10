import { useState, useEffect } from "react";
import Tableau from "../../../composant/Table/tableau";
import Header from "../../../composant/header";
import { useParams } from "react-router-dom/dist/umd/react-router-dom.development";
import { useQuery } from "@tanstack/react-query";
import {
  fetchInvestmentById,
  fetchInvestments,
} from "../../../service/investment.service";
import Loader from "../../../composant/loader/loader";
import { HttpStatusCode } from "axios";
import { formatAmount } from "../../../utils/fonctionnel";
import { useLocation } from "react-router";

export default function PageInvestment() {
  const { id } = useParams();

  const location = useLocation().pathname;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectOpe, setSelectOpe] = useState(false);
  const [clickResearch, setClickResearch] = useState(false);

  const { isLoading, data, isFetching, refetch } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const {
    isLoading: loadingTransac,
    data: dataTransactions,
    isFetching: fetchingTransac,
  } = useQuery({
    queryKey: ["fetchInvestmentById", id],
    queryFn: async () => {
      const response = await fetchInvestmentById(id);
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const processTransactions = (data) => {
    return data.flatMap((item) => {
      if (item && item.transaction) {
        if (Array.isArray(item.transaction)) {
          return item.transaction.map((trans) => ({
            ...item,
            transaction: trans,
          }));
        } else {
          return [
            {
              ...item,
              transaction: item.transaction,
            },
          ];
        }
      } else {
        return [];
      }
    });
  };
  // const isPageById =
  //   !location.includes("inprogress") &&
  //   !location.includes("sold") &&
  //   !location.includes("all");

  const normalizedData = processTransactions(data || []);
  const dataAll = normalizedData;
  const dataSold = normalizedData.filter(
    (item) => item.transaction.isSale === true
  );
  const dataInProgress = normalizedData.filter(
    (item) => item.transaction.isSale === false
  );
  const dataById = processTransactions([dataTransactions] || []);

  let investissements = [];
  let totalInvestissement = 0.0;
  let nbInvestissement = 0.0;

  if (location.includes("all")) {
    investissements = dataAll;
    totalInvestissement = formatAmount(
      dataAll.reduce(
        (total, item) => total + parseFloat(item.transaction.amount),
        0.0
      )
    );
    nbInvestissement = dataAll.length;
  } else if (location.includes("sold")) {
    investissements = dataSold;
    totalInvestissement = formatAmount(
      dataSold.reduce(
        (total, item) => total + parseFloat(item.transaction.amount),
        0.0
      )
    );
    nbInvestissement = dataSold.length;
  } else if (location.includes("inprogress")) {
    investissements = dataInProgress;
    totalInvestissement = formatAmount(
      dataInProgress.reduce(
        (total, item) => total + parseFloat(item.transaction.amount),
        0.0
      )
    );
    nbInvestissement = dataInProgress.length;
  } else {
    investissements = dataById;
    totalInvestissement = formatAmount(
      dataById?.reduce(
        (total, item) => total + parseFloat(item.transaction.amount),
        0.0
      )
    );
    nbInvestissement = dataById?.length;
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
    { id: 3, name: "Symbole" },
    { id: 2, name: "Nom" },
    { id: 4, name: "Date" },
    { id: 5, name: "Montant" },
    { id: 6, name: "Action" },
  ];

  const title =
    dataTransactions?.name ??
    (location.includes("inprogress")
      ? "Investissement en cours"
      : location.includes("all")
        ? "Tous les investissements"
        : location.includes("sold")
          ? "Investissements vendu"
          : "Investissement");

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="w-full relative">
        <Header
          title={title}
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
          isFetching={isFetching || fetchingTransac}
          refetch={refetch}
        />

        <div className="fixed w-44 bottom-10 right-0 rounded-l-xl shadow-2xl shadow-black bg-white dark:bg-black hover:opacity-0 py-3 transition-all">
          Total : <b>{totalInvestissement} €</b>
          <br />
          <b>{nbInvestissement}</b> transaction{nbInvestissement > 0 && "s"}
        </div>
      </section>
    </>
  );
}

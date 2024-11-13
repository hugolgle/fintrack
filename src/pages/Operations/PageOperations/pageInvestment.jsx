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
import { FormEditTransac } from "../../../composant/Form/FormEditTransac";

export default function PageInvestment() {
  const { id } = useParams();

  const location = useLocation().pathname;

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

  if (location.includes("all")) {
    investissements = dataAll;
  } else if (location.includes("sold")) {
    investissements = dataSold;
  } else if (location.includes("inprogress")) {
    investissements = dataInProgress;
  } else {
    investissements = dataById;
  }

  const columns = [
    { id: 2, name: "Type" },
    { id: 3, name: "Symbole" },
    { id: 4, name: "Nom" },
    { id: 5, name: "Date" },
    { id: 6, name: "Montant" },
    { id: 7, name: "Action" },
  ];

  const formatData = investissements.map(
    ({ _id, name, type, symbol, transaction }) => {
      return {
        _id: transaction._id,
        idInvest: _id,
        type,
        symbol,
        name,
        date: transaction.date,
        amount: transaction.amount,
        isSale: transaction.isSale,
      };
    }
  );
  const isId =
    location.includes("inprogress") ||
    location.includes("all") ||
    location.includes("sold");
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
          btnSearch
          btnReturn
          btnAdd={!isId}
          btnSelect
          btnTrash
        />

        <Tableau
          data={formatData}
          columns={columns}
          type="investments"
          isFetching={isFetching || fetchingTransac}
          refetchTransacInvest={refetch}
        />
      </section>
    </>
  );
}

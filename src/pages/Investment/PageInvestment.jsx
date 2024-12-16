import Tableau from "../../composant/Table/Table";
import Header from "../../composant/Header.jsx";
import { useQuery } from "@tanstack/react-query";
import {
  fetchInvestmentById,
  fetchInvestments,
} from "../../Service/Investment.service.jsx";
import Loader from "../../composant/Loader/Loader";
import { HttpStatusCode } from "axios";
import { useLocation } from "react-router";
import { useParams } from "react-router";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormEditInvestment } from "../../Pages/Investment/FormEditInvestment";
import { useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";

import { deleteTransaction } from "../../Service/Investment.service.jsx";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../../composant/Routes.jsx";
import { formatEuro } from "../../utils/fonctionnel.js";

export default function PageInvestment() {
  const { id } = useParams();
  const location = useLocation().pathname;

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

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

  const { data: dataTransactions, isFetching: fetchingTransac } = useQuery({
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

  const mutationDeleteInvestmentTransaction = useMutation({
    mutationFn: async (itemId) => {
      return await deleteTransaction(dataTransactions?._id, itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
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
    { id: 2, name: "Type", key: "type" },
    { id: 4, name: "Nom", key: "name" },
    { id: 5, name: "Date", key: "date" },
    { id: 6, name: "Montant", key: "amount" },
    { id: 7, name: "Action", key: "isSale" },
  ];

  const displayData = investissements.map(
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

  const performSearch = (term) => {
    const filteredData = displayData.filter((item) => {
      const nameMatches = item.name?.toLowerCase().includes(term.toLowerCase());
      const typeMatches = item.type?.toLowerCase().includes(term.toLowerCase());
      const dateMatches = item.date?.toLowerCase().includes(term.toLowerCase());
      const amountMatches = item.amount
        .toString()
        .toLowerCase()
        .includes(term.toLowerCase());

      return nameMatches || typeMatches || dateMatches || amountMatches;
    });
    setSearchResults(filteredData);
  };

  const isId = ["inprogress", "all", "sold"].some((key) =>
    location.includes(key)
  );

  const title =
    dataTransactions?.name ??
    (location.includes("inprogress")
      ? "Investissement en cours"
      : location.includes("all")
        ? "Tous les investissements"
        : location.includes("sold")
          ? "Investissements vendu"
          : "Investissement");

  const formatData = (row) => {
    return [
      row.type,
      row.name,
      format(row.date, "PP", { locale: fr }),
      formatEuro.format(row.amount),
      row.isSale ? "Vente" : "Achat",
    ];
  };

  const avatar = (item) => {
    const category = item.type === "Crypto" ? "crypto" : "symbol";
    return (
      <Avatar key="avatar" className="size-6">
        <AvatarImage
          src={`https://assets.parqet.com/logos/${category}/${item.symbol}`}
        />
      </Avatar>
    );
  };

  const action = (item) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuItem
            onClick={() => {
              navigate(ROUTES.INVESTMENT_BY_ID.replace(":id", item.idInvest));
            }}
            onSelect={(e) => e.preventDefault()}
          >
            <Eye className="mr-2 h-4 w-4" />
            Voir
          </DropdownMenuItem>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <FormEditInvestment transaction={item} refetch={refetch} />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem
            onClick={() => {
              mutationDeleteInvestmentTransaction.mutate(item._id);
            }}
            onSelect={(e) => e.preventDefault()}
            className="text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="w-full relative">
        <Header
          title={title}
          typeProps="investment"
          btnSearch
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          btnReturn
          btnAdd={!isId && "add"}
          btnSelect
          btnTrash={!isId}
        />

        <Tableau
          formatData={formatData}
          data={searchTerm ? searchResults : displayData}
          columns={columns}
          type="investments"
          isFetching={isFetching || fetchingTransac}
          action={action}
          firstItem={avatar}
        />
      </section>
    </>
  );
}

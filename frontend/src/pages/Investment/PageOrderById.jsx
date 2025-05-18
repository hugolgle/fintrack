import Tableau from "../../components/Table/Table.jsx";
import Header from "../../components/Header.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInvestmentById } from "../../Service/Investment.service.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { HttpStatusCode } from "axios";
import { useLocation } from "react-router";
import { useParams } from "react-router";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormEditInvestment } from "./FormEditInvestment.jsx";
import { useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, MoreHorizontal } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";

import { deleteTransaction } from "../../service/investment.service.jsx";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../../components/Routes.jsx";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { toast } from "sonner";
import { FormEditOrder } from "./FormEditOrder.jsx";

export default function PageOrderById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const queryClient = useQueryClient();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const {
    isLoading,
    data: dataTransactionsByInvestment,
    isFetching,
    refetch,
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

  const mutationDeleteInvestment = useMutation({
    mutationFn: async (ids) => {
      return await deleteTransaction(ids);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchInvestmentById", id]);
      refetch();
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

  const dataById = processTransactions([dataTransactionsByInvestment] || []);

  let investissements = [];
  let routeBtnAdd = "";

  if (location.pathname === ROUTES.INVESTMENT_ALL) {
    investissements = dataAll;
    routeBtnAdd = ROUTES.ADD_ORDER;
  } else if (location.pathname === ROUTES.INVESTMENT_SOLD) {
    investissements = dataSold;
    routeBtnAdd = ROUTES.ADD_ORDER;
  } else if (location.pathname === ROUTES.INVESTMENT_IN_PROGRESS) {
    investissements = dataInProgress;
    routeBtnAdd = ROUTES.ADD_ORDER;
  } else {
    investissements = dataById;
    routeBtnAdd = "add";
  }

  const columns = [
    { id: 1, name: "Type", key: "type" },
    { id: 2, name: "Nom", key: "name" },
    { id: 3, name: "Date", key: "date" },
    { id: 4, name: "Montant", key: "amount" },
    { id: 5, name: "Action", key: "isSale" },
  ];

  const displayData = investissements.map(
    ({ _id, name, type, symbol, transaction, createdAt }) => {
      return {
        _id: transaction._id,
        idInvest: _id,
        type,
        symbol,
        name: symbol ? `${name} (${symbol})` : name,
        date: transaction.date,
        amount: transaction.amount,
        isSale: transaction.isSale,
        createdAt,
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

  const title =
    dataTransactionsByInvestment?.name ??
    (location.pathname === ROUTES.INVESTMENT_IN_PROGRESS
      ? "Investissement en cours"
      : location.pathname === ROUTES.INVESTMENT_ALL
        ? "Tous les investissements"
        : location.pathname === ROUTES.INVESTMENT_SOLD
          ? "Investissements vendu"
          : "Investissement");

  const formatData = (row) => {
    return [
      row.type,
      row.name,
      format(row.date, "PP", { locale: fr }),
      formatCurrency.format(row.amount),
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
    const ids = {
      idInvest: item.idInvest,
      itemId: item._id,
    };
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          {item.idInvest !== id && (
            <DropdownMenuItem
              onClick={() => {
                navigate(ROUTES.INVESTMENT_BY_ID.replace(":id", item.idInvest));
              }}
              onSelect={(e) => e.preventDefault()}
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
          )}
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
              mutationDeleteInvestment.mutate(ids);
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

  const data = searchTerm ? searchResults : displayData;

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="w-full relative">
        <Header
          title={title}
          btnSearch={{ handleSearchChange, searchTerm }}
          btnReturn
          btnAdd={routeBtnAdd}
          isFetching={isFetching}
          actionEdit={
            <Dialog>
              <DialogTrigger asChild>
                <Pencil
                  size={20}
                  className="cursor-pointer hover:scale-110 transition-all"
                />
              </DialogTrigger>
              <DialogContent>
                <FormEditOrder
                  transaction={dataTransactionsByInvestment}
                  refetch={refetch}
                />
              </DialogContent>
            </Dialog>
          }
        />

        <Tableau
          formatData={formatData}
          data={data}
          columns={columns}
          type="investments"
          isFetching={isFetching}
          action={action}
          firstItem={avatar}
        />
      </section>
    </>
  );
}

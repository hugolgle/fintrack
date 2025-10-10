import Tableau from "../../components/tables/table.jsx";
import Header from "../../components/headers.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInvestments } from "../../services/investment.service.jsx";
import Loader from "../../components/loaders/loader.jsx";
import { HttpStatusCode } from "axios";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormEditInvestment } from "./formEditInvestment.jsx";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Plus } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";
import { deleteTransaction } from "../../services/investment.service.jsx";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye } from "lucide-react";
import { ROUTES } from "../../components/route.jsx";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { toast } from "sonner";
import FormAddInvestmentMain from "./formAddInvestmentMain.jsx";
import { useAmountVisibility } from "../../context/AmountVisibilityContext.jsx";

export default function PageInvestment() {
  const { isVisible } = useAmountVisibility();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: dataInvestments,
    isFetching,
    refetch,
  } = useQuery({
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

  const mutationDeleteInvestment = useMutation({
    mutationFn: async (ids) => {
      return await deleteTransaction(ids);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchInvestments"]);
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

  const normalizedData = processTransactions(dataInvestments || []);
  const dataAll = normalizedData;
  const dataSold = normalizedData.filter(
    (item) => item.transaction.type === "sell"
  );

  const dataInProgress = normalizedData.filter(
    (item) => item.transaction.type === "buy"
  );

  let investissements = [];

  if (location.pathname === ROUTES.INVESTMENT_ALL) {
    investissements = dataAll;
  } else if (location.pathname === ROUTES.INVESTMENT_SOLD) {
    investissements = dataSold;
  } else if (location.pathname === ROUTES.INVESTMENT_IN_PROGRESS) {
    investissements = dataInProgress;
  } else {
    investissements = [];
  }

  const columns = [
    { id: 2, name: "Type", key: "type" },
    { id: 4, name: "Nom", key: "name" },
    { id: 5, name: "Date", key: "date" },
    { id: 6, name: "Montant", key: "amount" },
    { id: 7, name: "Action", key: "type" },
  ];

  const displayData = investissements
    .filter((t) => t.transaction.type !== "dividend")
    .map(({ _id, name, type, symbol, isin, transaction, createdAt }) => {
      return {
        _id: transaction._id,
        idInvest: _id,
        type,
        symbol,
        isin,
        name: symbol ? `${name} (${symbol})` : name,
        date: transaction.date,
        amount: transaction.amount,
        action: transaction.type,
        createdAt,
      };
    });

  const data = displayData;

  const title =
    location.pathname === ROUTES.INVESTMENT_IN_PROGRESS
      ? "Investissement en cours"
      : location.pathname === ROUTES.INVESTMENT_ALL
        ? "Tous mes investissements"
        : location.pathname === ROUTES.INVESTMENT_SOLD
          ? "Investissements vendu"
          : "Investissement";

  const formatData = (row) => {
    return [
      row.type,
      row.name,
      format(row.date, "PP", { locale: fr }),
      isVisible ? formatCurrency.format(row.amount) : "••••",
      row.action === "sell"
        ? "Vente"
        : row.action === "buy"
          ? "Achat"
          : "Dividende",
    ];
  };

  const avatar = (item) => {
    const category = item.type === "Crypto" ? "crypto" : "symbol";
    return (
      <Avatar key="avatar" className="size-6">
        <AvatarImage
          src={
            item.isin
              ? `https://assets.parqet.com/logos/isin/${item.isin}`
              : `https://assets.parqet.com/logos/${category}/${item.symbol}`
          }
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

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="w-full relative">
        <Header
          title={title}
          btnReturn
          navigation={
            <>
              <Dialog modal>
                <DialogTrigger>
                  <Button>
                    <Plus />
                    <p className="hidden md:block">Nouveau investissement</p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <FormAddInvestmentMain refetch={refetch} />
                </DialogContent>
              </Dialog>
            </>
          }
          isFetching={isFetching}
        />

        <Tableau
          formatData={formatData}
          data={data}
          columns={columns}
          type="investments"
          isFetching={isFetching}
          action={action}
          firstItem={avatar}
          multiselect
          fieldsFilter={[
            { key: "type", fieldName: "Type" },
            { key: "action", fieldName: "Action" },
          ]}
          dateFilter
        />
      </section>
    </>
  );
}

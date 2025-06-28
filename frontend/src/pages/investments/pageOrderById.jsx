import Tableau from "../../components/tables/table.jsx";
import Header from "../../components/headers.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInvestmentById } from "../../services/investment.service.jsx";
import Loader from "../../components/loaders/loader.jsx";
import { HttpStatusCode } from "axios";
import { useLocation } from "react-router";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormEditInvestment } from "./formEditInvestment.jsx";
import { useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, MoreHorizontal, Plus } from "lucide-react";
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
import { FormEditOrder } from "./formEditOrder.jsx";
import FormAddInvestmentMain from "./formAddInvestmentMain.jsx";
import FormAddInvestment from "./formAddInvestment.jsx";
import { useAmountVisibility } from "../../context/AmountVisibilityContext.jsx";

export default function PageOrderById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isVisible } = useAmountVisibility();
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

  const columns = [
    { id: 1, name: "Type", key: "type" },
    { id: 2, name: "Nom", key: "name" },
    { id: 3, name: "Date", key: "date" },
    { id: 4, name: "Montant", key: "amount" },
    { id: 5, name: "Action", key: "type" },
  ];

  const displayData = dataById.map(
    ({ _id, name, type, symbol, transaction, createdAt }) => {
      return {
        _id: transaction._id,
        idInvest: _id,
        type,
        symbol,
        name: symbol ? `${name} (${symbol})` : name,
        date: transaction.date,
        amount: transaction.amount,
        action: transaction.type,
        createdAt,
      };
    }
  );

  const title = dataTransactionsByInvestment?.name;

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

  const data = displayData;

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="w-full relative">
        <Header
          title={title}
          btnReturn
          navigation={
            <div className="flex items-center justify-center gap-4">
              <Dialog modal>
                <DialogTrigger>
                  <Button className="aspect-square w-fit">
                    <Plus />
                    <p className="hidden md:block">Nouveau investissement</p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <FormAddInvestment refetch={refetch} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        className="aspect-square w-fit active:scale-90 transition-all"
                      >
                        <Pencil
                          size={20}
                          className="cursor-pointer hover:scale-110 transition-all"
                        />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Modifier l'{dataTransactionsByInvestment.type}</p>
                  </TooltipContent>
                </Tooltip>

                <DialogContent>
                  <FormEditOrder
                    transaction={dataTransactionsByInvestment}
                    refetch={refetch}
                  />
                </DialogContent>
              </Dialog>
            </div>
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
          fieldsFilter={[{ key: "action", fieldName: "Action" }]}
          dateFilter
        />
      </section>
    </>
  );
}

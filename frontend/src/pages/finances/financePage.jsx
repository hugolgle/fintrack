import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getTransactionsByType } from "../../utils/operations.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { months, nameType } from "../../utils/other.js";
import Header from "../../components/headers.jsx";
import Tableau from "../../components/tables/table.jsx";
import {
  deleteTransactions,
  fetchTransactions,
} from "../../services/transaction.service.jsx";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/loaders/loader.jsx";
import { HttpStatusCode } from "axios";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Dot,
  EllipsisVertical,
} from "lucide-react";
import { Pencil } from "lucide-react";
import { FormTransac } from "./formFinance.jsx";
import { Trash } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { FormAddRefund } from "./formAddRefund.jsx";
import { TicketSlash } from "lucide-react";
import { Plus } from "lucide-react";
import ModalTable from "../epargns/modal/modalTable.jsx";
import { toast } from "sonner";
import { TYPES } from "../../staticDatas/staticData.js";
import { useAmountVisibility } from "../../context/AmountVisibilityContext.jsx";

export default function PageTransaction({ type }) {
  const { isVisible } = useAmountVisibility();
  const { year, month } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dateSelected = year ? (month ? `${year}${month}` : year) : "all";

  const {
    isLoading,
    data: dataTransactions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const mutationDeleteTransaction = useMutation({
    mutationFn: async (itemId) => {
      return await deleteTransactions(itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchTransactions"]);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const dataTransacs = getTransactionsByType(dataTransactions, type);

  const dataTransacsByYear = dataTransacs?.filter((transaction) => {
    const transactionYear = transaction.date.slice(0, 4);
    return transactionYear === year;
  });

  const dataTransacsByMonth = dataTransacs?.filter((transaction) => {
    const transactionDate = transaction.date.split("T")[0];
    const transactionMonth = transactionDate.slice(0, 7);

    return transactionMonth === `${year}-${month}`;
  });

  const transactions = !year
    ? dataTransacs
    : year && !month
      ? dataTransacsByYear
      : month && dataTransacsByMonth;

  const displayData = transactions.map(
    ({
      _id,
      type,
      title,
      category,
      detail,
      amount,
      initialAmount,
      refunds,
      tag,
      date,
      createdAt,
    }) => {
      return {
        _id,
        type,
        title,
        category,
        date,
        detail,
        refunds,
        tag,
        amount,
        initialAmount,
        createdAt,
      };
    }
  );

  const handleChange = (value, typeDate) => {
    const currentMonth = typeDate === "month" ? value : month;
    const currentYear = typeDate === "year" ? value : year;

    if (currentYear && !currentMonth) {
      navigate(`/finance/transactions/${type.toLowerCase()}/${currentYear}`);
    } else if (currentMonth && currentYear) {
      navigate(
        `/finance/transactions/${type.toLowerCase()}/${currentYear}/${currentMonth}`
      );
    }
  };

  const columns = [
    {
      id: 1,
      name: "Titre",
      key: "title",
    },
    {
      id: 2,
      name: "Catégorie",
      key: "category",
    },
    {
      id: 3,
      name: "Date",
      key: "date",
    },
    {
      id: 4,
      name: "Montant",
      key: "amount",
    },
  ];

  const convertDate = (date) => {
    const annee = Math.floor(date / 100);
    const mois = date % 100;
    return `${months[mois - 1]} ${annee}`;
  };

  const pastilleType = (item) => {
    return item.type === "Expense" ? (
      <Dot color="red" />
    ) : item.type === "Revenue" ? (
      <Dot color="green" />
    ) : null;
  };

  const formatData = (row) => {
    return [
      <div className="flex flex-col lg:flex-row gap-2 items-center">
        <div className="flex gap-2 items-center">
          {row.title}
          {row.category === "Crédit" && (
            <CreditCard strokeWidth={1} color="grey" />
          )}
        </div>
        {row.tag.map((t, index) => (
          <Badge
            key={index}
            className="group relative flex items-center animate-pop-up gap-2"
            variant="secondary"
          >
            {t}
          </Badge>
        ))}
      </div>,
      <Badge
        className="group w-fit relative flex items-center animate-pop-up gap-2"
        variant="outline"
      >
        {row.category}
      </Badge>,
      format(row.date, "PP", { locale: fr }),
      row.refunds.length > 0 ? (
        <div className="flex gap-2 items-center">
          {isVisible ? formatCurrency.format(row.amount) : "••••"}
          <TicketSlash strokeWidth={1} color="grey" />
        </div>
      ) : row.type === TYPES.INCOME ? (
        <p className="text-green-500">
          +{isVisible ? formatCurrency.format(row.amount) : "••••"}
        </p>
      ) : (
        <p className="text-red-500">
          {isVisible ? formatCurrency.format(row.amount) : "••••"}
        </p>
      ),
    ];
  };

  const action = (item) => {
    const columns = [
      { id: 1, name: "Titre", key: "title" },
      { id: 2, name: "Date", key: "date" },
      { id: 3, name: "Montant", key: "amount" },
    ];
    const formatData = (row) => {
      return [
        row.title,
        format(row.date, "PP", { locale: fr }),
        isVisible ? formatCurrency.format(row.amount) : "••••",
      ];
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          {item.type === TYPES.EXPENSE && (
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un remb.
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <FormAddRefund transaction={item} refetch={refetch} />
              </DialogContent>
            </Dialog>
          )}

          {item?.refunds && item?.refunds?.length > 0 && (
            <ModalTable
              initialAmount={item.initialAmount}
              btnOpen={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TicketSlash className="mr-2 h-4 w-4" />
                  Remboursement(s)
                </DropdownMenuItem>
              }
              data={item?.refunds}
              formatData={formatData}
              columns={columns}
              title="Remboursements"
              description="Liste des remboursements."
            />
          )}

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <FormTransac
                key={item}
                editMode
                transaction={item}
                refetch={refetch}
                type={type}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem
            onClick={() => {
              mutationDeleteTransaction.mutate(item._id);
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
      <section className="w-full">
        <Header
          title={
            type === "Expense"
              ? "Mes Dépenses"
              : type === "Revenue"
                ? "Mes Revenus"
                : "Mes Finances"
          }
          subtitle={
            !type
              ? "Toutes les transactions"
              : !year
                ? `Toutes les ${nameType(type).toLowerCase()}s`
                : year && !month
                  ? `${nameType(type)}s de l'année ${dateSelected}`
                  : `${nameType(type)}s de ${convertDate(dateSelected)}`
          }
          isFetching={isFetching}
          navigation={
            <div className="flex justify-end items-center gap-4">
              <div className="flex gap-4 items-center">
                {/* Mois */}
                {month && year && (
                  <Select
                    onValueChange={(value) => handleChange(value, "month")}
                    defaultValue={month || ""}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Mois" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthValue = String(i + 1).padStart(2, "0");
                        const monthLabel = new Date(0, i).toLocaleString(
                          "fr-FR",
                          {
                            month: "long",
                          }
                        );
                        return (
                          <SelectItem key={monthValue} value={monthValue}>
                            {monthLabel}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
                {/* Année */}

                {year && (
                  <Select
                    onValueChange={(value) => handleChange(value, "year")}
                    defaultValue={year || ""}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2023, 2024, 2025, 2026].map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Dialog modal>
                <DialogTrigger>
                  <Button>
                    <Plus />
                    <p className="hidden md:block">Nouvelle transaction</p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <FormTransac refetch={refetch} type={type} />
                </DialogContent>
              </Dialog>
            </div>
          }
          btnReturn
        />

        <Tableau
          data={data}
          columns={columns}
          action={action}
          type="transactions"
          formatData={formatData}
          firstItem={pastilleType}
          multiselect
          fieldsFilter={[
            { key: "category", fieldName: "Catégorie" },
            { key: "tag", fieldName: "Tag" },
            { key: "title", fieldName: "Titre" },
          ]}
          dateFilter={!month && !year}
        />
      </section>
    </>
  );
}

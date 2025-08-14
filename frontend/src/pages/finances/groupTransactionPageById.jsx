import React from "react";
import Header from "../../components/headers";
import {
  CreditCard,
  Dot,
  EllipsisVertical,
  Pencil,
  Plus,
  TicketSlash,
  Trash,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGroupTransaction,
  fetchGroupTransactionById,
  removeTransactionFromGroup,
} from "../../services/groupTransaction.service";
import { HttpStatusCode } from "axios";
import SkeletonDashboard from "../../components/skeletonBoard";
import { useNavigate, useParams } from "react-router";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Tableau from "../../components/tables/table";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";
import { formatCurrency } from "../../utils/fonctionnel";
import { TYPES } from "../../staticDatas/staticData";
import { format } from "date-fns";
import { FormEditGroup } from "./formEditGroup";
import { FormAddTransactionsToGroup } from "./formAddTransactionsGroup";
import { toast } from "sonner";
import { ROUTES } from "../../components/route";
import ModalTable from "../epargns/modal/modalTable";
import { FormAddRefund } from "./formAddRefund";
import { FormTransac } from "./formFinance";

function GroupTransactionByIdPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isVisible } = useAmountVisibility();
  const {
    isLoading,
    data: dataGroupTransaction,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetchGroupTransactionById", id],
    queryFn: async () => {
      const response = await fetchGroupTransactionById(id);
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const mutationDelete = useMutation({
    mutationFn: async (itemId) => {
      return await deleteGroupTransaction(itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchGroupTransactions"]);
      refetch();
      navigate(ROUTES.GROUP_TRANSACTION);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const mutationRemoveTransactionFromGroup = useMutation({
    mutationFn: async (itemId) => {
      return await removeTransactionFromGroup(dataGroupTransaction._id, itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

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

  const pastilleType = (item) => {
    return item.type === "Expense" ? (
      <Dot color="red" />
    ) : item.type === "Revenue" ? (
      <Dot color="green" />
    ) : null;
  };

  const displayData = dataGroupTransaction?.transactions?.map(
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
                type={item.type}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem
            onClick={() => {
              mutationRemoveTransactionFromGroup.mutate(item._id);
            }}
            onSelect={(e) => e.preventDefault()}
            className="text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer du groupe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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

  if (isLoading) return <SkeletonDashboard />;

  return (
    <section className="w-full">
      <Header
        title={dataGroupTransaction?.name}
        subtitle={dataGroupTransaction?.description}
        isFetching={isFetching}
        navigation={
          <>
            <Dialog modal>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Ajouter des transactions
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FormAddTransactionsToGroup
                  refetch={refetch}
                  dataGroupTransaction={dataGroupTransaction}
                />
              </DialogContent>
            </Dialog>
            <Dialog modal>
              <DialogTrigger asChild>
                <Button className="aspect-square w-fit active:scale-90 transition-all">
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <FormEditGroup
                  refetch={refetch}
                  dataGroupTransaction={dataGroupTransaction}
                />
              </DialogContent>
            </Dialog>
            <Dialog modal>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="aspect-square w-fit active:scale-90 transition-all"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                    Es-tu sûr de vouloir supprimer ce groupe ? Cette action est
                    irréversible.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-between">
                  <Button
                    type="submit"
                    onClick={() => {
                      mutationDelete.mutate(dataGroupTransaction._id);
                    }}
                  >
                    Oui
                  </Button>
                  <DialogClose>
                    <Button variant="outline" type="button">
                      Non
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <Tableau
        data={displayData}
        columns={columns}
        type="transactions"
        action={action}
        formatData={formatData}
        firstItem={pastilleType}
        multiselect
        fieldsFilter={[
          { key: "category", fieldName: "Catégorie" },
          { key: "tag", fieldName: "Tag" },
          { key: "title", fieldName: "Titre" },
        ]}
        dateFilter
      />
    </section>
  );
}

export default GroupTransactionByIdPage;

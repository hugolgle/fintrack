import { useNavigate, useParams } from "react-router-dom";
import { addSpace } from "../../../utils/fonctionnel";
import {
  categoryRecette,
  categoryDepense,
} from "../../../../public/categories.json";

import { useQuery, useMutation } from "@tanstack/react-query";
import { categorySort } from "../../../utils/other";
import { toast } from "sonner";
import { DialogDelete } from "../../../composant/dialogDelete";
import Header from "../../../composant/header";
import {
  deleteTransactions,
  fetchTransactionById,
  fetchTransactions,
} from "../../../service/transaction.service";
import Loader from "../../../composant/loader/loader";
import { useTheme } from "../../../context/ThemeContext";
import { HttpStatusCode } from "axios";
import { DialogEdit } from "../../../composant/dialogEdit";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

export default function Transaction() {
  const { id } = useParams();
  const { data } = useQuery({
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

  const {
    data: transaction,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["fetchTransactionById", id],
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
    refetchOnMount: true,
  });

  const navigate = useNavigate();
  const categoryD = categorySort(categoryDepense);
  const categoryR = categorySort(categoryRecette);

  const mutationDelete = useMutation({
    mutationFn: async () => {
      return await deleteTransactions(id);
    },
    onSuccess: (response) => {
      navigate(-1);
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const handleDeleteConfirmation = () => mutationDelete.mutate();

  const typeProps =
    transaction?.data?.type === "Expense"
      ? "expense"
      : transaction?.data?.type === "Revenue"
        ? "revenue"
        : undefined;

  const { theme } = useTheme();
  const bgColor =
    theme === "custom"
      ? "bg-colorPrimaryCustom"
      : "bg-colorPrimaryLight dark:bg-colorPrimaryDark";

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <section className="w-full">
      <Header
        title={transaction?.data?.title}
        typeProps={typeProps}
        btnAdd
        btnReturn
        isFetching={isFetching}
      />
      <div className="flex flex-row gap-4 animate-fade">
        <div className="flex flex-col w-3/4 gap-4 ">
          <div className="flex flex-row gap-4">
            <div
              className={`h-40 w-full ${bgColor} flex justify-center items-center rounded-2xl overflow-hidden`}
            >
              <h2 className="text-4xl">{transaction?.data?.category}</h2>
            </div>

            <div
              className={`h-40 w-full ${bgColor} flex justify-center items-center rounded-2xl overflow-hidden`}
            >
              <h2 className="text-4xl">
                {format(transaction?.data?.date, "d MMMM yyyy", { locale: fr })}
              </h2>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div
              className={`h-40 w-full ${bgColor} flex justify-center items-center rounded-2xl overflow-hidden`}
            >
              <div className="flex flex-col">
                <h2 className="text-4xl">
                  {addSpace(parseFloat(transaction?.data?.amount).toFixed(2))} €
                </h2>
              </div>
            </div>
          </div>

          {transaction?.data?.detail && (
            <div
              className={`h-40 w-full ${bgColor} flex justify-center items-center rounded-2xl overflow-hidden`}
            >
              <h2 className="text-xl">{transaction?.data?.detail}</h2>
            </div>
          )}
        </div>
        <div className="flex flex-col w-1/4 justify-between">
          <div className="flex flex-col gap-4">
            <div
              className={`p-8 h-32 ${bgColor} rounded-2xl flex justify-center items-center`}
            >
              <p>
                Ajouter le : <br />
                <b>
                  {" "}
                  {format(transaction?.data?.createdAt, "dd/MM/yyyy à HH:mm")}
                </b>
              </p>
            </div>
            {transaction?.data?.updatedAt !== transaction?.data?.createdAt && (
              <div
                className={`p-8 h-32 ${bgColor} rounded-2xl flex justify-center items-center`}
              >
                <p>
                  Dernière modification le : <br />
                  <b>
                    {format(transaction?.data?.updatedAt, "dd/MM/yyyy à HH:mm")}
                  </b>
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4">
            <DialogEdit
              transaction={transaction}
              refetch={refetch}
              data={data}
            />

            <div className="flex flex-col gap-4 justify-center items-center">
              <DialogDelete
                handleDelete={handleDeleteConfirmation}
                isPending={mutationDelete.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

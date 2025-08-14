import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchTransactions } from "../../services/transaction.service";
import { addTransactionToGroup } from "../../services/groupTransaction.service";

const validationSchema = yup.object({
  transactionIds: yup
    .array()
    .min(1, "Sélectionnez au moins une transaction")
    .required(),
});

export function FormAddTransactionsToGroup({ refetch, dataGroupTransaction }) {
  const queryClient = useQueryClient();
  const { isLoading, data: dataTransactions } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      return response.data;
    },
    refetchOnMount: true,
  });

  const mutationAdd = useMutation({
    mutationFn: (groupData) =>
      addTransactionToGroup(dataGroupTransaction._id, groupData),
    onSuccess: () => {
      toast.success("Les transactions ont été ajoutées au groupe");
      formik.resetForm();
      queryClient.invalidateQueries("fetchTransactions");
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Erreur");
    },
  });

  const formik = useFormik({
    initialValues: {
      transactionIds: [],
    },
    validationSchema,
    onSubmit: (values) => {
      mutationAdd.mutate(values.transactionIds);
    },
  });

  useEffect(() => {
    if (dataGroupTransaction) {
      formik.setFieldValue(
        "transactionIds",
        dataGroupTransaction.transactions.map((t) => t._id)
      );
    }
  }, [dataGroupTransaction]);

  function toggleTransaction(id) {
    formik.setFieldValue(
      "transactionIds",
      formik.values.transactionIds.includes(id)
        ? formik.values.transactionIds.filter((tid) => tid !== id)
        : [...formik.values.transactionIds, id]
    );
  }

  const existingIds =
    dataGroupTransaction?.transactions.map((t) => t._id) || [];

  const filteredTransactions = (dataTransactions ?? []).filter(
    (t) => !existingIds.includes(t._id)
  );

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      <DialogHeader>
        <DialogTitle>Ajouter des transactions</DialogTitle>
        <DialogDescription>
          Ajouter des transactions à un groupe.
        </DialogDescription>
      </DialogHeader>

      <div className=" max-h-[60vh] overflow-auto border rounded p-2 my-4">
        {isLoading ? (
          <p>Chargement des transactions...</p>
        ) : filteredTransactions.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left">Sélection</th>
                <th className="p-2 text-left">Titre</th>
                <th className="p-2 text-left">Montant</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((t) => (
                  <tr key={t._id} className="border-b">
                    <td className="p-2">
                      <Checkbox
                        checked={formik.values.transactionIds.includes(t._id)}
                        onCheckedChange={() => toggleTransaction(t._id)}
                      />
                    </td>
                    <td className="p-2">{t.title || "Transaction"}</td>
                    <td className="p-2">{t.amount?.toFixed(2)} €</td>
                    <td className="p-2">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune transaction trouvée.</p>
        )}
      </div>

      <DialogFooter className="flex justify-between">
        <Button type="submit" disabled={mutationAdd.isLoading}>
          {mutationAdd.isLoading ? "Ajout..." : "Ajouter au groupe"}
        </Button>

        <DialogClose>
          <Button variant="outline" type="button">
            Annuler
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}

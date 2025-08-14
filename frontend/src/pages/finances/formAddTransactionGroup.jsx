import React from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  addTransactionToGroup,
  fetchGroupTransactions,
} from "../../services/groupTransaction.service";

const validationSchema = yup.object({
  groupId: yup.string().required("Sélectionnez un groupe"),
});

export function FormAddTransactionToGroup({ refetch, transaction }) {
  const queryClient = useQueryClient();

  const { data: dataGroupTransactions, isLoading } = useQuery({
    queryKey: ["fetchGroupTransactions"],
    queryFn: async () => {
      const response = await fetchGroupTransactions();
      return response?.data || [];
    },
    refetchOnMount: true,
  });

  const formik = useFormik({
    initialValues: {
      groupId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutationAdd.mutate(values.groupId);
    },
  });

  const mutationAdd = useMutation({
    mutationFn: (groupId) => addTransactionToGroup(groupId, [transaction._id]),
    onSuccess: () => {
      toast.success("Transaction ajoutée au groupe");
      formik.resetForm();
      queryClient.invalidateQueries("fetchGroupTransactions");
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Erreur");
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-4xl">
      <DialogHeader>
        <DialogTitle>Ajouter au groupe</DialogTitle>
        <DialogDescription>
          Sélectionnez un groupe pour ajouter cette transaction.
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[60vh] overflow-auto border rounded p-2 my-4">
        {isLoading ? (
          <p>Chargement des groupes...</p>
        ) : dataGroupTransactions.length > 0 ? (
          <RadioGroup
            value={formik.values.groupId}
            onValueChange={(val) => formik.setFieldValue("groupId", val)}
            className="flex flex-col gap-2 max-h-[60vh] overflow-auto"
          >
            {dataGroupTransactions
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((t) => (
                <div
                  key={t._id}
                  className="flex items-center gap-2 border-b p-2"
                >
                  <RadioGroupItem value={t._id} />
                  <Label>{t.name || "Groupe"}</Label>
                </div>
              ))}
          </RadioGroup>
        ) : (
          <p>Aucun groupe trouvé.</p>
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

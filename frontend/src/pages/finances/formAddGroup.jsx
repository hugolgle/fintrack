import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { addGroupTransaction } from "../../services/groupTransaction.service";
import { fetchTransactions } from "../../services/transaction.service";

const nameSchema = yup.object({
  name: yup.string().required("Le nom est requis"),
  description: yup.string().required("La description est requis"),
});

export function FormAddGroup({ refetch }) {
  const [step, setStep] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const queryClient = useQueryClient();

  const { isLoading, data: dataTransactions } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      return response.data;
    },
    refetchOnMount: true,
  });

  const [filterTag, setFilterTag] = useState("");

  const allTags = Array.from(
    new Set((dataTransactions ?? []).flatMap((t) => t.tag || []))
  );

  const filteredTransactions = filterTag
    ? (dataTransactions ?? []).filter((t) => t.tag?.includes(filterTag))
    : (dataTransactions ?? []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema: nameSchema,
    onSubmit: () => {
      setStep(2);
    },
  });

  const mutationAdd = useMutation({
    mutationFn: (groupData) => addGroupTransaction(groupData),
    onSuccess: () => {
      toast.success("Groupe créé");
      formik.resetForm();
      setSelectedTransactions([]);
      setStep(1);
      queryClient.invalidateQueries(["fetchGroupTransactions"]);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Erreur");
    },
  });

  function toggleTransaction(id) {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  }

  function handleSubmitGroup() {
    mutationAdd.mutate({
      name: formik.values.name,
      description: formik.values.description,
      transactionIds: selectedTransactions,
    });
  }

  return (
    <form
      onSubmit={step === 1 ? formik.handleSubmit : (e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>Créer un groupe de transactions</DialogTitle>
        <DialogDescription>
          {step === 1
            ? "Donnez un nom à votre groupe."
            : "Sélectionnez les transactions à ajouter."}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {step === 1 && (
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              name="name"
              placeholder="Titre"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
            <Input
              id="description"
              name="description"
              placeholder="Description"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <>
            {isLoading ? (
              <p>Chargement des transactions...</p>
            ) : (
              <div className="max-h-64 overflow-auto border rounded p-2">
                <Select
                  value={filterTag || "all"}
                  onValueChange={(value) =>
                    setFilterTag(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un tag" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-4">
                  {filteredTransactions && filteredTransactions?.length > 0 ? (
                    filteredTransactions?.map((t) => (
                      <label
                        key={t._id}
                        className="flex items-center space-x-2 cursor-pointer py-1"
                      >
                        <Checkbox
                          checked={selectedTransactions.includes(t._id)}
                          onCheckedChange={() => toggleTransaction(t._id)}
                        />
                        <span>{t.title || t.name || "Transaction"}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {t.amount?.toFixed(2)} €
                        </span>
                      </label>
                    ))
                  ) : (
                    <p>Aucune transaction trouvée.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DialogFooter className="flex justify-between">
        {step === 2 && (
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={mutationAdd.isLoading}
          >
            Retour
          </Button>
        )}
        {step === 1 && (
          <Button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Suivant
          </Button>
        )}
        {step === 2 && (
          <Button
            type="button"
            onClick={handleSubmitGroup}
            disabled={
              selectedTransactions.length === 0 || mutationAdd.isLoading
            }
          >
            {mutationAdd.isLoading ? "Création..." : "Créer le groupe"}
          </Button>
        )}
        <DialogClose>
          <Button variant="outline" type="button">
            Annuler
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}

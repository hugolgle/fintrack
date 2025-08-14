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
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { editGroupTransaction } from "../../services/groupTransaction.service";

const validationSchema = yup.object({
  name: yup.string().required("Le nom est requis"),
  description: yup.string().required("La description est requis"),
});

export function FormEditGroup({ refetch, dataGroupTransaction }) {
  const formik = useFormik({
    initialValues: {
      name: dataGroupTransaction.name,
      description: dataGroupTransaction.description,
    },
    validationSchema,
    onSubmit: (values) => {
      mutationEdit.mutate(values);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (groupData) => {
      return await editGroupTransaction(dataGroupTransaction._id, groupData);
    },
    onSuccess: () => {
      toast.success("Groupe modifié avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Erreur");
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>Modifier le groupe de transactions</DialogTitle>
        <DialogDescription>
          Modifié les informations du groupe.
        </DialogDescription>
      </DialogHeader>

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

      <DialogFooter className="flex justify-between">
        <Button type="submit" disabled={mutationEdit.isLoading}>
          {mutationEdit.isLoading ? "Modification..." : "Modifier le groupe"}
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

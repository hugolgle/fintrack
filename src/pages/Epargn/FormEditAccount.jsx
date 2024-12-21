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
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ButtonLoading from "../../composant/Button/ButtonLoading";
import { editAccount } from "../../Service/Epargn.service";

const validationSchema = yup.object().shape({
  name: yup.string().required("Le nom est requis"),
  interestRate: yup
    .number()
    .typeError("Le taux d'intérêt doit être un nombre")
    .min(0, "Le taux d'intérêt ne peut pas être négatif")
    .required("Le taux d'intérêt est requis"),
  maxBalance: yup
    .number()
    .typeError("Le plafond doit être un nombre")
    .min(0, "Le plafond ne peut pas être négatif")
    .required("Le plafond est requis"),
});

export function FormEditAccount({ account, refetch }) {
  const initialValues = {
    name: account.name || "",
    interestRate: account.interestRate || "",
    maxBalance: account.maxBalance || "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutationEdit.mutate(values);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (values) => {
      const editData = {
        id: account._id,
        name: values.name,
        interestRate: values.interestRate,
        maxBalance: values.maxBalance,
      };
      return await editAccount(editData);
    },
    onSuccess: (response) => {
      formik.resetForm();
      toast.success(response?.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.message);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>Modifier le compte</DialogTitle>
        <DialogDescription>
          Modifiez les informations du compte.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          name="name"
          placeholder="Nom du compte"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.name}
          </p>
        )}

        <Input
          name="interestRate"
          type="number"
          step="0.01"
          placeholder="Taux d'intérêt"
          {...formik.getFieldProps("interestRate")}
        />
        {formik.touched.interestRate && formik.errors.interestRate && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.interestRate}
          </p>
        )}

        <Input
          name="maxBalance"
          type="number"
          step="0.01"
          placeholder="Plafond"
          {...formik.getFieldProps("maxBalance")}
        />
        {formik.touched.maxBalance && formik.errors.maxBalance && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.maxBalance}
          </p>
        )}
      </div>

      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          type="submit"
          text="Modifier"
          isPending={mutationEdit.isPending}
          disabled={mutationEdit.isPending || !formik.isValid}
        />
        <DialogClose>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}

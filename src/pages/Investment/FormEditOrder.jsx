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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ButtonLoading from "../../components/Button/ButtonLoading";
import { editInvestments } from "../../Service/Investment.service";

const validationSchema = yup.object().shape({
  type: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  name: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  symbol: yup.string().when(["type"], {
    is: (type) => type === "Action" || type === "Crypto",
    then: (schema) =>
      schema
        .required("Le symbole est requis")
        .uppercase("Le symbole doit être en majuscules"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export function FormEditOrder({ transaction, refetch }) {
  const initialValues = {
    type: transaction.type || "",
    name: transaction.name || "",
    symbol: transaction.symbol || "",
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
        id: transaction._id,
        type: values.type,
        name: values.name,
        symbol: values.symbol,
      };
      return await editInvestments(editData);
    },
    onSuccess: (response) => {
      formik.resetForm();
      toast.success(response?.data?.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>Modifier l'ordre</DialogTitle>
        <DialogDescription>
          Modifiez les informations de l'ordre.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Select
          name="type"
          value={formik.values.type}
          onValueChange={(value) => formik.setFieldValue("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Action">Action</SelectItem>
            <SelectItem value="ETF">ETF</SelectItem>
            <SelectItem value="Crypto">Crypto</SelectItem>
            <SelectItem value="Obligation">Obligation</SelectItem>
            <SelectItem value="Dérivé">Dérivé</SelectItem>
          </SelectContent>
        </Select>
        {formik.touched.type && formik.errors.type && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.type}
          </p>
        )}
        <Input
          name="name"
          placeholder="Titre"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.name}
          </p>
        )}
        <Input
          name="symbol"
          placeholder="Symbole"
          {...formik.getFieldProps("symbol")}
        />
        {formik.touched.symbol && formik.errors.symbol && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.symbol}
          </p>
        )}
      </div>

      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          type="submit"
          text="Modifier"
          isPending={mutationEdit.isPending}
          disabled={mutationEdit.isPending}
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
